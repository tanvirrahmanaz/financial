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
import LoginPage from './pages/LoginPage.jsx'; // Make sure this is imported

import CourseUploadPage from './pages/CourseUploadPage.jsx';
import CourseDetailsPage from './pages/CourseDetailsPage.jsx';


// Dummy components for other routes
const CoursesPage = () => <div className="h-96 flex items-center justify-center text-3xl">Courses Page</div>;
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
    path: "/role-select",
    element: <RoleSelectPage />,
  },
  {
    path: "/login/:role", // Dynamic route for parent/children
    element: <LoginPage />,
  },
  {
    path: "/signup/:role", // Dynamic route for parent/children
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
        path: "upload-course", // নতুন রাউট
        element: <CourseUploadPage />,
      },
      {
        path: "courses/:courseId", // নতুন ডায়নামিক রাউট
        element: <CourseDetailsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire app with AuthProvider */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);