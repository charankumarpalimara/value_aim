import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
import "./Header.css";

function Header({ onSignupClick, onLoginClick }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="header">
      <div className="logo-section">
        <img src={logoImage} alt="Value AIM Logo" className="logo-image" />
      </div>
      <div className="header-actions">
        {!isMobile && (
          <>
            <a href="#" className="nav-link">About Us</a>
            <a href="#" className="nav-link">Contact Us</a>
            <button className="header-btn" onClick={() => { 
              if (onLoginClick) {
                onLoginClick();
              } else {
                navigate('/login');
              }
              setIsMobileMenuOpen(false); 
            }}>Login</button>
            <button className="header-btn primary" onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}>Signup for Free</button>
          </>
        )}
        {isMobile && (
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>
      {isMobile && (
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <a href="#" className="mobile-nav-link">About Us</a>
            <a href="#" className="mobile-nav-link">Contact Us</a>
            <div className="mobile-menu-buttons">
              <button className="header-btn" onClick={() => { 
                if (onLoginClick) {
                  onLoginClick();
                } else {
                  navigate('/login');
                }
                setIsMobileMenuOpen(false); 
              }}>Login</button>
              <button className="header-btn primary" onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}>Signup for Free</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
