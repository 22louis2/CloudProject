import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/" element={<Home />} />
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

export default App;