import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import OTPScreen from "./components/OTPScreen";
import FormFlow from "./components/FormFlow";
import { GOOGLE_CLIENT_ID } from './config';
import "./styles/global.css";
import "antd/dist/reset.css";

// Protected Route Component - Checks if user is authenticated
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Component with React Router
export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OTPScreen />} />
            <Route 
              path="/company-details" 
              element={
                <ProtectedRoute>
                  <FormFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-details" 
              element={
                <ProtectedRoute>
                  <FormFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <FormFlow />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}
