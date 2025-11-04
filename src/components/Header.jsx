import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
// import faviconImage from "../assets/va_fav.png";
import "./Header.css";

function Header({ onSignupClick, onLoginClick }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle scroll to change header style
  useEffect(() => {
    const handleScroll = (e) => {
      const scrollTop = e.target === document ? window.scrollY : e.target.scrollTop;
      if (scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Listen to window scroll
    window.addEventListener('scroll', handleScroll);
    
    // Listen to page container scroll (for pages with their own scroll)
    const aboutUsPage = document.querySelector('.about-us-page');
    const contactUsPage = document.querySelector('.contact-us-page');
    
    if (aboutUsPage) {
      aboutUsPage.addEventListener('scroll', handleScroll);
    }
    if (contactUsPage) {
      contactUsPage.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (aboutUsPage) {
        aboutUsPage.removeEventListener('scroll', handleScroll);
      }
      if (contactUsPage) {
        contactUsPage.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo-section" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        {/* <img src={faviconImage} alt="ValueAIM" className="header-favicon" /> */}
        <img src={logoImage} alt="Value AIM Logo" className="logo-image" />
      </div>
      <div className="header-actions">
        {!isMobile && (
          <>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact-us" className="nav-link">Contact Us</Link>
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
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact-us" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
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
