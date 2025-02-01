import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const UserProfile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h1>{user.name}</h1>
            <img src={user.profileImage} alt="Profile" />
            <p>{user.email}</p>
        </div>
    );
};

export default UserProfile;