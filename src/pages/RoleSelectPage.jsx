// src/pages/RoleSelectPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleCard = ({ role, image, selectedRole, setSelectedRole }) => {
  const isSelected = selectedRole === role.toLowerCase();
  return (
    <div
      onClick={() => setSelectedRole(role.toLowerCase())}
      className={`border-2 ${isSelected ? 'border-green-400 shadow-lg' : 'border-gray-200'} 
                  p-4 rounded-2xl text-center cursor-pointer transition-all duration-300 w-48`}
    >
      <img src={image} alt={role} className="w-full h-40 object-cover rounded-lg mb-3" />
      <p className="font-semibold text-gray-700">{role}</p>
    </div>
  );
};

const RoleSelectPage = () => {
  const [selectedRole, setSelectedRole] = useState('parent');
  const navigate = useNavigate();

  const handleContinue = () => {
    // Role সিলেক্ট করার পর সেই অনুযায়ী লগইন পেজে নিয়ে যাবে
    navigate(`/login/${selectedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4">
      {/* Logo */}
      <div className="absolute top-6 left-6 text-left">
        <h1 className="text-lg font-bold text-dark-brown">Chotto Shonchoyi</h1>
        <p className="text-xs text-gray-500 -mt-1">Financial Literacy</p>
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-10">What is your role?</h2>
        
        <div className="flex flex-col sm:flex-row gap-8 mb-12">
          <RoleCard 
            role="Parent" 
            image="https://i.ibb.co/6y405wQ/family-image.png" 
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
          <RoleCard 
            role="Children" 
            image="https://i.ibb.co/xJ52Cmq/kids-image.png"
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        </div>

        <button 
          onClick={handleContinue}
          className="bg-green-300 text-gray-800 font-bold py-3 px-10 rounded-full shadow-md hover:bg-green-400 transition-colors flex items-center gap-2 mx-auto"
        >
          Continue <span className="text-xl">→</span>
        </button>
      </div>
    </div>
  );
};

export default RoleSelectPage;
