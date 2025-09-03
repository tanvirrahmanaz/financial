// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase/firebase.config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [googleUser, setGoogleUser] = useState(null);
    const [formData, setFormData] = useState({
        displayName: '',
        age: '',
        favoriteHobby: '',
        favoriteSubject: '',
        favoriteCartoon: '',
        email: '',
        password: '',
        childrenUsername: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({
            displayName: '',
            age: '',
            favoriteHobby: '',
            favoriteSubject: '',
            favoriteCartoon: '',
            email: '',
            password: '',
            childrenUsername: '',
        });
        setError('');
    }, [role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSignIn = async () => {
        setError('');
        const user = await signInWithGoogle();
        if (user) {
            setGoogleUser(user);
        } else {
            setError('Google sign-in failed. Please try again.');
        }
    };

    const handleFinalSignup = async (e) => {
        e.preventDefault();
        setError('');

        let payload = {};

        if (role === 'children') {
            if (!formData.displayName || !formData.age) {
                return setError("Display Name and Age are required.");
            }
            if (!googleUser) {
                return setError("Please sign up with Google first.");
            }
            payload = {
                ...formData,
                email: googleUser.email,
                role: 'child',
                password: '', // No password for Google users
            };
        } else if (role === 'parent') {
            if (!formData.displayName || !formData.email || !formData.password || !formData.childrenUsername) {
                return setError("All fields are required.");
            }
            payload = {
                ...formData,
                role: 'parent',
            };
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Signup successful!');
                login({ displayName: data.displayName, role: data.role });
                navigate('/dashboard');
            } else {
                setError(data.message || 'Signup failed.');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
        }
    };

    const renderFormFields = () => {
        if (role === 'parent') {
            return (
                <>
                    <div className="mb-4">
                        <label className="block text-gray-700">Display Name</label>
                        <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Children's Username (Must)</label>
                        <input type="text" name="childrenUsername" value={formData.childrenUsername} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                        Create Parent Account
                    </button>
                </>
            );
        }

        if (role === 'children') {
            return (
                <>
                    {!googleUser ? (
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">You must sign up with your Google account.</p>
                            <button onClick={handleGoogleSignIn} className="w-full mt-2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
                                <i className="fab fa-google mr-2"></i> Sign Up with Google
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-700 mb-4 text-center">Google account connected: <span className="font-semibold">{googleUser.email}</span></p>
                            <p className="text-gray-600 mb-4 text-center">Please provide a few more details to complete your profile.</p>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700">Display Name</label>
                                <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Favorite Hobby</label>
                                <input type="text" name="favoriteHobby" value={formData.favoriteHobby} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Favorite Subject</label>
                                <input type="text" name="favoriteSubject" value={formData.favoriteSubject} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700">Favorite Cartoon</label>
                                <input type="text" name="favoriteCartoon" value={formData.favoriteCartoon} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                                Complete Signup
                            </button>
                        </>
                    )}
                </>
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Navbar is not included here */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 capitalize">{role} Signup</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleFinalSignup}>
                    {renderFormFields()}
                </form>

                <div className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link to={`/login/${role}`} className="text-blue-600 hover:underline">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;