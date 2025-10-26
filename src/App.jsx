import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import FormFlow from "./components/FormFlow";
import { GOOGLE_CLIENT_ID } from './config';
import "./styles/global.css";
import "antd/dist/reset.css";

// Main App Component with React Router
export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/company-details" element={<FormFlow />} />
            <Route path="/service-details" element={<FormFlow />} />
            <Route path="/results" element={<FormFlow />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}
