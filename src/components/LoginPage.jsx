import React, { useState } from "react";
import Header from "./Header";
import { GoogleLogo, MicrosoftLogo, AppleLogo } from "./BrandLogos";
import { FaPhone } from "react-icons/fa";
import "./LoginPage.css";

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (email.trim()) {
      onNavigate('company-details');
    }
  };

  return (
    <div className="login-page">
      <Header onNavigate={onNavigate} />
      
      <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">Log in or sign up</h2>
          <p className="login-subtitle">Smarter responses & file uploads available.</p>
          
          <div className="social-login">
            <button className="social-btn google-btn">
              <span className="social-icon"><GoogleLogo /></span>
              Google
            </button>
            <button className="social-btn microsoft-btn">
              <span className="social-icon"><MicrosoftLogo /></span>
              Microsoft
            </button>
            <button className="social-btn apple-btn">
              <span className="social-icon"><AppleLogo /></span>
              Apple
            </button>
            <button className="social-btn phone-btn">
              <span className="social-icon"><FaPhone /></span>
              Phone
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="email-section">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
            <button className="continue-btn" onClick={handleContinue}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
