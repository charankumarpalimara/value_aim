import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import OTPScreen from "./components/OTPScreen";
import FormFlow from "./components/FormFlow";
import AutoLogin from "./components/AutoLogin";
import { GOOGLE_CLIENT_ID } from './config';
import "./styles/global.css";
import "antd/dist/reset.css";

// Protected Route Component - Checks if user is authenticated
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const tokenExpiration = localStorage.getItem('tokenExpiration');
  
  // Check if token exists and is not expired
  if (!token || !user || (tokenExpiration && new Date(tokenExpiration) < new Date())) {
    // Token expired or missing - clear storage and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
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
          <AutoLogin>
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
          </AutoLogin>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}
