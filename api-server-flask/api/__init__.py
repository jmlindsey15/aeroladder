# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os, json, traceback

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .routes import rest_api
from .models import db

app = Flask(__name__)

app.config.from_object('api.config.BaseConfig')

db.init_app(app)
migrate = Migrate(app, db)
rest_api.init_app(app)
CORS(app)

#database initialization
with app.app_context():
    def initialize_database():
        try:
            db.create_all()
            print("> Database initialized successfully!")  # Optional: This will let you know if everything worked fine.
        except Exception as e:
            print('> Error: DBMS Exception: ' + str(e))
            print(traceback.format_exc())  # This will print the detailed error trace

            # fallback to SQLite
            BASE_DIR = os.path.abspath(os.path.dirname(__file__))
            app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')

            print('> Fallback to SQLite')
            try:
                db.create_all()
            except Exception as e:
                print("> Error initializing SQLite: " + str(e))
                print(traceback.format_exc())  # This will print the detailed error trace for SQLite as well

    initialize_database()

"""
   Custom responses
"""

@app.after_request
def after_request(response):
    """
       Sends back a custom error with {"success", "msg"} format
    """

    if int(response.status_code) >= 400:
        response_data = json.loads(response.get_data())
        if "errors" in response_data:
            response_data = {"success": False,
                             "msg": list(response_data["errors"].items())[0][1]}
            response.set_data(json.dumps(response_data))
        response.headers.add('Content-Type', 'application/json')
    return response
