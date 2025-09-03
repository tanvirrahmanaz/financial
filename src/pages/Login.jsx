// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../firebase/firebase.config';

const LoginPage = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                login(data);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        const googleUser = await signInWithGoogle();
        if (googleUser) {
            try {
                const response = await fetch('http://localhost:5000/api/users/google-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: googleUser.email }),
                });
                const data = await response.json();
                if (response.ok) {
                    login(data);
                    navigate('/dashboard');
                } else {
                    setError(data.message || 'Google login failed.');
                }
            } catch (err) {
                setError('A network error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Navbar is not included here */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 capitalize">{role} Login</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
                <form onSubmit={handleManualLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                        Login
                    </button>
                </form>
                {role === 'children' && (
                    <div className="mt-4 text-center">
                        <p className="text-gray-500">Or log in with Google</p>
                        <button onClick={handleGoogleLogin} className="w-full mt-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
                            <i className="fab fa-google mr-2"></i> Sign In with Google
                        </button>
                    </div>
                )}
                
                <div className="mt-6 text-center text-sm">
                    Don't have an account?{' '}
                    <Link to={`/signup/${role}`} className="text-blue-600 hover:underline">
                        Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;