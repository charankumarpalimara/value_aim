import React, { useState } from "react";
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
import "./Header.css";

function Header({ onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="header">
      <div className="logo-section">
        <img src={logoImage} alt="Value AIM Logo" className="logo-image" />
      </div>
      <div className="header-actions">
        <a href="#" className="nav-link">About Us</a>
        <a href="#" className="nav-link">Contact Us</a>
        <button className="header-btn" onClick={() => onNavigate && onNavigate('login')}>Login</button>
        <button className="header-btn primary">Signup for Free</button>
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <a href="#" className="mobile-nav-link">About Us</a>
          <a href="#" className="mobile-nav-link">Contact Us</a>
          <div className="mobile-menu-buttons">
            <button className="header-btn" onClick={() => onNavigate && onNavigate('login')}>Login</button>
            <button className="header-btn primary" onClick={() => onNavigate && onNavigate('login')}>Signup for Free</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
