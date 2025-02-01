import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';



const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: user.name, profileImage: user.profileImage });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/edit-profile', formData);
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="file" name="profileImage" onChange={handleChange} />
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default EditProfile;