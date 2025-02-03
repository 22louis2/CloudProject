import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import './App.css';
import heroImage from './your-hero-image.jpg'; // Import the hero image

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="home" style={{ backgroundImage: `url(${heroImage})` }}> {/* Hero div with inline style */}
                    <div className="home-content"> {/* Content container */}
                        <Navbar /> {/* Navbar inside the hero div */}
                        <Routes>
                            <Route path="/" element={<HomePage />} /> {/* Add a Home route */}
                            <Route path="/login" element={<GuestRoute component={<Login />} />} />
                            <Route path="/signup" element={<GuestRoute component={<SignUp />} />} />
                            <Route path="/profile" element={<PrivateRoute component={<UserProfile />} />} />
                            <Route path="/edit-profile" element={<PrivateRoute component={<EditProfile />} />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

const HomePage = () => ( // New component for the actual Home page content
    <div>
        <h1>Welcome to the Auth Application</h1>
        <p>Please sign up or log in to continue.</p>
    </div>
);

// PrivateRoute: Redirects unauthenticated users to the login page
const PrivateRoute = ({ component }) => {
    const { user } = useContext(AuthContext);
    return user ? component : <Navigate to="/login" />;
};

// GuestRoute: Redirects authenticated users away from login or signup pages
const GuestRoute = ({ component }) => {
    const { user } = useContext(AuthContext);
    return user ? <Navigate to="/profile" /> : component;
};

export default App;