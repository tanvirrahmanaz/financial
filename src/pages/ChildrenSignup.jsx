// client/src/pages/ChildrenSignup.jsx
import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';

const ChildrenSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    favoriteHobby: '',
    favoriteSubject: '',
    favoriteCartoon: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/children-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      navigate('/login');
    } else {
      alert(data.error);
    }
  };

  const handleGoogleSignIn = async () => {
    const data = await signInWithGoogle(formData.username, formData.age, formData.favoriteHobby);
    if (data.message) {
      alert(data.message);
      navigate('/login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Children Signup</h2>
        <form onSubmit={handleManualSubmit}>
          {/* Input fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email (Optional for Google)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password (Optional for Google)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" required />
          </div>
          {/* Other input fields */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>OR</p>
          <button onClick={handleGoogleSignIn} className="w-full mt-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300">
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildrenSignup;