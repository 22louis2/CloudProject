import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null); // Clear user from context
        localStorage.removeItem("authToken"); // Remove token from local storage
        navigate("/login"); // Redirect to login after logout
    };

    // Optimized authentication check
    const isAuthenticated = !!(user && user.token?.trim()); // Ensures token is present & non-empty

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>

            {!isAuthenticated ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                </>
            ) : (
                <a onClick={handleLogout}>Logout</a> // Use button for logout
            )}
        </nav>
    );
};

export default Navbar;
