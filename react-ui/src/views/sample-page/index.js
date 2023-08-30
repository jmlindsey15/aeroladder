import React, { useState, useEffect } from 'react';

// material-ui
import {Grid, Typography} from '@material-ui/core';

// project imports
import MainCard from '../../ui-component/cards/MainCard';

import axios from 'axios';
//==============================|| SAMPLE PAGE ||==============================//

const SamplePage = () => {
    const [users, setUsers] = useState([]);

        useEffect(() => {
            // Fetch all users when component mounts
            axios.get('/api/users')
            .then(response => {
                if(response.data.success) {
                    setUsers(response.data.users);
                } else {
                    console.error("Failed to fetch users");
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
        }, []);


    return (
        <MainCard title="All Users">
            <Typography variant="body2">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.email}>  // Assuming each user object has a unique 'id' property
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Typography>
        </MainCard>
    );
};

export default SamplePage;
