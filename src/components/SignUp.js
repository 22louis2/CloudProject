import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        profileImage: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State for errors
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password || !/^(?=.*[!@#$%^&*])(?=.{8,})/.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters long and include at least one special character.";
        }

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Please enter your name.";
        }

        if (formData.profileImage && !formData.profileImage.type.startsWith("image/")) {
            newErrors.profileImage = "Please upload a valid image file (JPEG, PNG).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e) => {
        if (e.target.name === "profileImage") {
            setFormData({ ...formData, profileImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Validate before submission

        setLoading(true);
        try {
            const signupData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                filename: formData.profileImage ? formData.profileImage.name : "",
                contentType: formData.profileImage ? formData.profileImage.type : ""
            };

            const response = await axios.post(
                "https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/signup",
                signupData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 201) {
                if (formData.profileImage && response.data.uploadURL) {
                    await uploadImageToS3(response.data.uploadURL, formData.profileImage);
                }
                navigate("/login");
            }
        } catch (error) {
            console.error("Error signing up:", error);
            setErrors({ submit: error.response?.data?.message || "Signup failed. Please try again." }); // Set error message
        } finally {
            setLoading(false);
        }
    };

    const uploadImageToS3 = async (uploadURL, file) => {
        try {
            await axios.put(uploadURL, file, {
                headers: {
                    "Content-Type": file.type
                }
            });
        } catch (error) {
            console.error("Error uploading image to S3:", error);
            setErrors({ submit: "Failed to upload profile image. Please try again." }); // Set error message
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="error">{errors.email}</p>}

            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            {errors.password && <p className="error">{errors.password}</p>}

            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className="error">{errors.name}</p>}

            <input type="file" name="profileImage" onChange={handleChange} accept="image/*" />
            {errors.profileImage && <p className="error">{errors.profileImage}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
            </button>
            {errors.submit && <p className="error">{errors.submit}</p>}
        </form>
    );
};

export default SignUp;
