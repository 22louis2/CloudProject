import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const [errors, setErrors] = useState({}); // State for errors
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.password) {
            newErrors.password = "Please enter your password.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop submission if form is invalid

        try {
            const response = await axios.post('https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/login', formData);
            login(response.data);
            navigate('/profile');
        } catch (error) {
            console.error('Login failed:', error);
            setErrors({ submit: "Incorrect credentials. Please try again." }); // Set error message
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="error">{errors.email}</p>} {/* Display email error */}

            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            {errors.password && <p className="error">{errors.password}</p>} {/* Display password error */}

            <button type="submit">Login</button>
            {errors.submit && <p className="error">{errors.submit}</p>} {/* Display submit error */}
        </form>
    );
};

export default Login;
