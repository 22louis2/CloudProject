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
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === "profileImage") {
            setFormData({ ...formData, profileImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Step 1: Call signup API to get the signed upload URL
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
                console.log("Signup successful!", response.data);

                // Step 2: If a profile image was selected, upload it to S3
                if (formData.profileImage && response.data.uploadURL) {
                    await uploadImageToS3(response.data.uploadURL, formData.profileImage);
                }

                // Step 3: Redirect to login after successful signup
                navigate("/login");
            } else {
                console.error("Unexpected response:", response);
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error signing up:", error);
            alert(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to upload the image to S3 using a PUT request
    const uploadImageToS3 = async (uploadURL, file) => {
        try {
            await axios.put(uploadURL, file, {
                headers: {
                    "Content-Type": file.type
                }
            });
            console.log("Image uploaded successfully to S3!");
        } catch (error) {
            console.error("Error uploading image to S3:", error);
            alert("Failed to upload profile image. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="file" name="profileImage" onChange={handleChange} />
            <button type="submit" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
            </button>
        </form>
    );
};

export default SignUp;
