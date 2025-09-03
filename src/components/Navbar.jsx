// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/firebase.config';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { currentUser, appUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="py-4 bg-cream/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto max-w-6xl px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-left">
          <h1 className="text-lg font-bold text-dark-brown">The Little Savers</h1>
          <p className="text-xs text-gray-500 -mt-1">Financial Literacy</p>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
          <li><Link to="/" className="hover:text-dark-brown transition-colors">Home</Link></li>
          <li><Link to="/courses" className="hover:text-dark-brown transition-colors">Courses</Link></li>
          
          {/* ## Only show for parents ## */}
          {appUser && appUser.role === 'parent' && (
            <li>
              <Link to="/upload-course" className="bg-soft-yellow px-4 py-2 rounded-full hover:bg-amber-400 transition-colors">
                Upload Course
              </Link>
            </li>
          )}
          
          <li><Link to="/about" className="hover:text-dark-brown transition-colors">About Us</Link></li>
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <img
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=BFA87E&color=fff`}
                  alt="User profile"
                  className="w-10 h-10 rounded-full border-2 border-dark-khaki"
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br />
                    <span className="font-semibold">{currentUser.displayName || (appUser && appUser.displayName)}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Updated links to direct to the role selection page */}
              <Link to="/role-select" className="px-5 py-2 text-sm font-medium rounded-full border border-dark-brown/50 hover:bg-dark-brown/5 transition-colors">
                Log In
              </Link>
              <Link to="/role-select" className="px-5 py-2 text-sm font-medium rounded-full border border-dark-brown/50 hover:bg-dark-brown/5 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;