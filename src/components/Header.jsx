import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { Modal } from 'antd';
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
// import faviconImage from "../assets/va_fav.png";
import "./Header.css";

function Header({ onSignupClick, onLoginClick, showOnlyLogout = false, showOnlyLogo = false, disableLogoNavigation = false }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process (you can add API call here if needed)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    setIsLoggingOut(false);
    setIsLogoutModalVisible(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoClick = () => {
    if (!disableLogoNavigation) {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // If logged in, navigate to results page, otherwise to landing page
      if (token && user) {
        navigate('/results');
      } else {
        navigate('/');
      }
    }
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
    const companyPage = document.querySelector('.company-page');
    const serviceDetailsPage = document.querySelector('.service-details-page');
    
    if (aboutUsPage) {
      aboutUsPage.addEventListener('scroll', handleScroll);
    }
    if (contactUsPage) {
      contactUsPage.addEventListener('scroll', handleScroll);
    }
    if (companyPage) {
      companyPage.addEventListener('scroll', handleScroll);
    }
    if (serviceDetailsPage) {
      serviceDetailsPage.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (aboutUsPage) {
        aboutUsPage.removeEventListener('scroll', handleScroll);
      }
      if (contactUsPage) {
        contactUsPage.removeEventListener('scroll', handleScroll);
      }
      if (companyPage) {
        companyPage.removeEventListener('scroll', handleScroll);
      }
      if (serviceDetailsPage) {
        serviceDetailsPage.removeEventListener('scroll', handleScroll);
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

  return (
    <div className={`header ${isScrolled ? 'scrolled' : ''} ${showOnlyLogout ? 'logout-only' : ''} ${showOnlyLogo ? 'logo-only' : ''}`}>
      <div className="logo-section" onClick={handleLogoClick} style={{ cursor: disableLogoNavigation ? 'default' : 'pointer' }}>
        {/* <img src={faviconImage} alt="ValueAIM" className="header-favicon" /> */}
        <img src={logoImage} alt="Value AIM Logo" className="logo-image" />
      </div>
      <div className="header-actions">
        {showOnlyLogo ? (
          // When showOnlyLogo is true, show nothing (just logo)
          null
        ) : showOnlyLogout ? (
          // When showOnlyLogout is true, show logout button on both desktop and mobile
          <button className="header-btn" onClick={handleLogout}>Logout</button>
        ) : (
          // Normal header behavior
          <>
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
          </>
        )}
      </div>
        {isMobile && !showOnlyLogout && !showOnlyLogo && (
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

      {/* Logout Confirmation Modal */}
      {showOnlyLogout && (
        <Modal
          title="Logout"
          open={isLogoutModalVisible}
          onOk={confirmLogout}
          onCancel={() => setIsLogoutModalVisible(false)}
          okText={isLoggingOut ? "Logging out..." : "Yes"}
          cancelText="No"
          confirmLoading={isLoggingOut}
          cancelButtonProps={{ disabled: isLoggingOut }}
          centered
        >
          <p>Are you sure you want to logout?</p>
        </Modal>
      )}
    </div>
  );
}

export default Header;
