import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import './App.css';


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<GuestRoute component={<Login />} />} />
                    <Route path="/signup" element={<GuestRoute component={<SignUp />} />} />
                    <Route path="/profile" element={<PrivateRoute component={<UserProfile />} />} />
                    <Route path="/edit-profile" element={<PrivateRoute component={<EditProfile />} />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

const Home = () => {
    return (
        <div className="home">
            <h1>Welcome to the Auth Application</h1>
            <p>Please sign up or log in to continue.</p>
        </div>
    );
};

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
