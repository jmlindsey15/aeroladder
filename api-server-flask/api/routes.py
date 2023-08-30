# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request
from flask_restx import Api, Resource, fields
from .models import db, Users, JWTTokenBlocklist
from .config import BaseConfig
import requests


rest_api = Api(version="1.0", title="Users API")

signup_model = rest_api.model('SignUpModel', {
    "username": fields.String(required=True, min_length=2, max_length=32),
    "email": fields.String(required=True, min_length=4, max_length=64),
    "password": fields.String(required=True, min_length=4, max_length=16)
})

login_model = rest_api.model('LoginModel', {
    "email": fields.String(required=True, min_length=4, max_length=64),
    "password": fields.String(required=True, min_length=4, max_length=16)
})

user_edit_model = rest_api.model('UserEditModel', {
    "userID": fields.String(required=True, min_length=1, max_length=32),
    "username": fields.String(required=True, min_length=2, max_length=32),
    "email": fields.String(required=True, min_length=4, max_length=64)
})


"""
   Helper function for JWT token required
"""

def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        # Check for token in headers
        token = request.headers.get("authorization")

        if not token:
            return {"success": False, "msg": "Valid JWT token is missing"}, 400

        try:
            data = jwt.decode(token, BaseConfig.SECRET_KEY, algorithms=["HS256"])
            if not data.get("email"):
                return {"success": False, "msg": "Invalid JWT token. Missing data"}, 400

            current_user = Users.get_by_email(data["email"])
            if not current_user:
                return {"success": False, "msg": "User does not exist. Wrong auth token."}, 400

            token_expired = db.session.query(JWTTokenBlocklist.id).filter_by(jwt_token=token).scalar()
            if token_expired:
                return {"success": False, "msg": "Token revoked."}, 400

            if not current_user.check_jwt_auth_active():
                return {"success": False, "msg": "Token expired."}, 400

        except jwt.ExpiredSignatureError:
            return {"success": False, "msg": "Token has expired"}, 400
        except jwt.InvalidTokenError:
            return {"success": False, "msg": "Invalid token"}, 400

        return f(current_user, *args, **kwargs)

    return decorator

"""
    Flask-Restx routes
"""


@rest_api.route('/api/users/register')
class Register(Resource):
    """
       Creates a new user by taking 'signup_model' input
    """

    @rest_api.expect(signup_model, validate=True)
    def post(self):

        req_data = request.get_json()

        _username = req_data.get("username")
        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)
        if user_exists:
            return {"success": False,
                    "msg": "Email already taken"}, 400

        new_user = Users(username=_username, email=_email)

        new_user.set_password(_password)
        new_user.save()

        return {"success": True,
                "userID": new_user.id,
                "msg": "The user was successfully registered"}, 200


@rest_api.route('/api/users/login')
class Login(Resource):
    """
       Login user by taking 'login_model' input and return JWT token
    """

    @rest_api.expect(login_model , validate=True)
    def post(self):

        req_data = request.get_json()

        _email = req_data.get("email")
        _password = req_data.get("password")

        user_exists = Users.get_by_email(_email)

        # Debug: Check if user exists
        print(f"User with email {_email} exists:" , bool(user_exists))

        if not user_exists:
            return {"success": False ,
                    "msg": "This email does not exist."} , 400

        if not user_exists.check_password(_password):
            # Debug: Check for incorrect password
            print("Password check failed for user:" , _email)
            return {"success": False ,
                    "msg": "Wrong credentials."} , 400

        # Debug: Verify SECRET_KEY
        print("Secret Key:" , BaseConfig.SECRET_KEY)

        # create access token using JWT
        try:
            # Updated
            print("About to generate token with secret key:" , datetime.utcnow())
            payload = {'email': _email ,
                       'exp': datetime.utcnow() + timedelta(minutes=30)}
            print("Payload:" , payload)
            secret_key = BaseConfig.SECRET_KEY

            print("Secret Key:" , secret_key)

            token = (
                jwt.encode(
                {'email': _email ,
                        'exp': datetime.utcnow() + timedelta(minutes=30)} ,
                               BaseConfig.SECRET_KEY))
            print("Generated token:" , token)

            # Debug: Display the generated token
            print("Generated token:" , token)

            if not isinstance(token , bytes):
                print("Token is not of bytes type:" , token)

        except Exception as e:
            # Debug: Capture any errors during token generation
            print("Error generating token:" , str(e))
            return {"success": False , "msg": "Internal server error while generating token"} , 500

        user_exists.set_jwt_auth_active(True)
        user_exists.save()

        return {"success": True,
                "token": token,
                "user": user_exists.toJSON()}, 200

@rest_api.route('/api/users/edit')
class EditUser(Resource):
    @rest_api.expect(user_edit_model)
    @token_required
    def post(self, current_user):
        req_data = request.get_json()
        _new_username = req_data.get("username")
        _new_email = req_data.get("email")

        if _new_username:
            current_user.username = _new_username  # Setting the new username

        if _new_email:
            current_user.email = _new_email  # Setting the new email

        db.session.commit()  # Saving the changes

        return {"success": True}, 200


@rest_api.route('/api/users/logout')
class LogoutUser(Resource):
    """
       Logs out User by revoking JWT token
    """

    @token_required
    def post(self , current_user):
        _jwt_token = request.headers["authorization"]
        # You can invalidate the token here by adding it to JWTTokenBlocklist or any other method you prefer.

        # Provide the current timestamp for the 'created_at' field
        revoked_token = JWTTokenBlocklist(jwt_token=_jwt_token , created_at=datetime.utcnow())
        db.session.add(revoked_token)
        db.session.commit()


@rest_api.route('/api/sessions/oauth/github/')
class GitHubLogin(Resource):
    def get(self):
        code = request.args.get('code')
        client_id = BaseConfig.GITHUB_CLIENT_ID
        client_secret = BaseConfig.GITHUB_CLIENT_SECRET
        root_url = 'https://github.com/login/oauth/access_token'

        params = { 'client_id': client_id, 'client_secret': client_secret, 'code': code }

        data = requests.post(root_url, params=params, headers={
            'Content-Type': 'application/x-www-form-urlencoded',
        })

        response = data._content.decode('utf-8')
        access_token = response.split('&')[0].split('=')[1]

        user_data = requests.get('https://api.github.com/user', headers={
            "Authorization": "Bearer " + access_token
        }).json()
        
        user_exists = Users.get_by_username(user_data['login'])
        if user_exists:
            user = user_exists
        else:
            try:
                user = Users(username=user_data['login'], email=user_data['email'])
                user.save()
            except:
                user = Users(username=user_data['login'])
                user.save()
        
        user_json = user.toJSON()

        token = jwt.encode({"username": user_json['username'], 'exp': datetime.utcnow() + timedelta(minutes=30)}, BaseConfig.SECRET_KEY)
        user.set_jwt_auth_active(True)
        user.save()

        return {"success": True,
                "user": {
                    "_id": user_json['_id'],
                    "email": user_json['email'],
                    "username": user_json['username'],
                    "token": token,
                }}, 200

    @rest_api.route('/api/users')
    class GetAllUsers(Resource):
        """
           Fetches all registered users
        """

        def get(self):
            # Assuming the toJSON() method of the User model returns all required data of the user
            users = [user.toJSON() for user in Users.query.all()]
            return {"success": True , "users": users} , 200