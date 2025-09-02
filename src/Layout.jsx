// src/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* The Outlet will render the component for the matched route */}
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default Layout;