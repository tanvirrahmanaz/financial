// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';

// Import AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';

// Import Layout and Page components
import Layout from './Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import RoleSelectPage from './pages/RoleSelectPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/Login.jsx';

import CoursesPage from './pages/CoursesPage.jsx';
import CourseUploadPage from './pages/CourseUploadPage.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

// Dummy components for other routes
const AboutPage = () => <div className="h-96 flex items-center justify-center text-3xl">About Us Page</div>;
const ContactPage = () => <div className="h-96 flex items-center justify-center text-3xl">Contact Page</div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "role-select",
        element: <RoleSelectPage />,
      },
      {
        path: "login/:role",
        element: <LoginPage />,
      },
      {
        path: "signup/:role",
        element: <SignUpPage />,
      },
      {
        path: "courses",
        element: <CoursesPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },  
      {
        path: "upload-course", 
        element: <CourseUploadPage />,
      },
      {
        path: "courses/:courseId", 
        element: <CourseDetailsPage />,
      },
      {
        path: 'admin-panel',
        element: <AdminPanel />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);