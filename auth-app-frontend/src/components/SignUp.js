import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '', profileImage: null });
    const navigate = useNavigate(); // React Router navigation hook

    const handleChange = (e) => {
        if (e.target.name === 'profileImage') {
            setFormData({ ...formData, profileImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                filename: formData.profileImage ? formData.profileImage.name : "",
                contentType: formData.profileImage ? formData.profileImage.type : ""
            };

            const response = await axios.post(
                'https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/signup',
                data,
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // ✅ If signup is successful, redirect to login page
            if (response.status === 201) {
                console.log('Signup successful! Redirecting to login...');
                navigate('/login'); // React Router navigation
            } else {
                console.error('Unexpected response:', response);
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error signing up:', error);

            // ✅ Handling different error cases
            if (error.response) {
                // The request was made, but the server responded with an error
                console.error('Server responded with:', error.response.data);
                alert(error.response.data.message || 'Signup failed. Please check your details and try again.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                alert('No response from server. Please check your internet connection.');
            } else {
                // Any other error
                console.error('Error:', error.message);
                alert('An unexpected error occurred. Please try again later.');
            }
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="file" name="profileImage" onChange={handleChange} />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
