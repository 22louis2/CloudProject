import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        filename: "",
        contentType: "",
        profileImage: "" // Stores the current image URL
    });
    const [isEditing, setIsEditing] = useState(false);

    // Default placeholder image
    const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    "https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/user",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setUser(response.data);
                setFormData({
                    email: response.data.email || "",
                    name: response.data.name || "",
                    filename: response.data.filename || "",
                    contentType: response.data.contentType || "",
                    profileImage: response.data.profileImage || ""
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [setUser]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                filename: file.name,
                contentType: file.type
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("authToken");

            if (!formData.filename || !formData.contentType) {
                alert("Please select an image before saving.");
                return;
            }

            const response = await axios.patch(
                "https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/user",
                {
                    filename: formData.filename,
                    contentType: formData.contentType
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Profile updated successfully:", response.data);

            // Update profile image with the new uploadURL
            setFormData((prev) => ({
                ...prev,
                profileImage: response.data.uploadURL
            }));

            setUser((prev) => ({
                ...prev,
                profileImage: response.data.uploadURL
            }));

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div>
            <h1>User Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={formData.name} disabled />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" value={formData.email} disabled />
                </label>
                <br />
                <label>
                    Profile Image:
                    <br />
                    <img
                        src={formData.profileImage ? formData.profileImage : placeholderImage}
                        alt="Profile"
                        width="150"
                    />
                    <br />
                    {isEditing && <input type="file" onChange={handleFileChange} />}
                </label>
                <br />
                {formData.filename && <p>Selected File: {formData.filename}</p>}
                <br />
                {isEditing ? (
                    <>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile Image
                    </button>
                )}
            </form>
        </div>
    );
};

export default UserProfile;
