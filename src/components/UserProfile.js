import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const UserProfile = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        filename: "",
        contentType: "",
        profileImage: "",
        file: null // ✅ Store the actual file object
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Default placeholder image
    const placeholderImage = "https://via.placeholder.com/150?text=No+Image";

    const fetchUserProfile = async () => {
        try {
            const token = user?.token;
            if (!token) return;

            const response = await axios.get(
                "https://drsf1zojgj.execute-api.us-east-1.amazonaws.com/prod/api/user",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setFormData({
                email: response.data.email || "",
                name: response.data.name || "",
                filename: response.data.filename || "",
                contentType: response.data.contentType || "",
                profileImage: response.data.profileImage || "",
                file: null // Reset file on load
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [user?.token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                filename: file.name,
                contentType: file.type,
                file: file // ✅ Store actual file object
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = user?.token;
            if (!token) {
                alert("Authentication error. Please log in again.");
                return;
            }

            if (!formData.file) {
                alert("Please select an image before saving.");
                return;
            }

            // Step 1: Request a signed upload URL from the API
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

            console.log("Profile update API response:", response.data);

            // Step 2: If we received an upload URL, upload the actual file to S3
            if (response.data.uploadURL) {
                await uploadImageToS3(response.data.uploadURL, formData.file);
            }

            // Step 3: Fetch updated user data after the image is uploaded
            await fetchUserProfile(); // ✅ Get the correct image URL after upload

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Function to upload the actual image file to S3
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
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
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
