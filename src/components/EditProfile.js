import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: user.name, profileImage: null });
    const [preview, setPreview] = useState(user.profileImage);

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            const file = e.target.files[0];
            setFormData({ ...formData, profileImage: file });
            setPreview(URL.createObjectURL(file)); // Image preview
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const data = new FormData();
            data.append('name', formData.name);
            if (formData.profileImage) {
                data.append('filename', formData.profileImage.name);
                data.append('contentType', formData.profileImage.type);
            }

            const response = await axios.patch('https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/user', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="file" name="profileImage" onChange={handleChange} />
            {preview && <img src={preview} alt="Profile Preview" />}
            <button type="submit">Update Profile</button>
        </form>
    );
};

export default EditProfile;
