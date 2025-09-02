// src/pages/LoginPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { auth, googleProvider } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State for form inputs and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handler for Email/Password Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Handler for Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError("Failed to log in. Please check your email and password.");
    }
  };

  // Handler for Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      console.error("Failed to sign in with Google", error);
      setError("Failed to sign in with Google.");
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex items-center justify-center py-12" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="w-full max-w-md text-center p-8 bg-white/60 rounded-2xl shadow-subtle">
        <h1 className="text-3xl font-bold text-dark-brown mb-4">Join Us</h1>
        <p className="text-gray-600 mb-6">
          Start your journey in financial literacy today!
        </p>

        {/* Email/Password Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow"
            required
          />
          {error && <p className="text-red-500 text-sm text-left">{error}</p>}
          <div className="flex gap-4">
             <button
              onClick={handleLogin}
              className="w-full bg-amber-400 bg-dark-brown text-black font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="w-full bg-amber-400 bg-dark-khaki text-black font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;