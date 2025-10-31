import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const menuRef = useRef(null);

  const handleSubmit = () => {
    if (website.trim() || selectedOption) {
      navigate('/login');
    }
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  const handleAddOption = (title) => {
    setSelectedOption(title);
    setShowPlusMenu(false);
  };

  const handleRemoveOption = () => {
    setSelectedOption(null);
  };

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlusMenu && menuRef.current && !menuRef.current.contains(event.target) 
          && !event.target.closest('.input-btn')) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu]);

  return (
    <div className="landing-page">
      <Header 
        onSignupClick={() => setShowSignupModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
      />
      
      <div className="landing-content">
        <h1 className="welcome-title">Research your Customer</h1>
        <p className="welcome-subtitle" style={{ fontStyle: 'italic' }}>Great Sales start here with Customer Insights.</p>
        
        <div className="input-container">
          {/* Plus Menu - Always positioned above input */}
          {showPlusMenu && (
            <div ref={menuRef} className="plus-menu-popup">
              <div className="plus-menu-header">
                <span>Add to Analysis</span>
              </div>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Understanding Customer\'s Business')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V4.5C2 4.10218 2.15804 3.72064 2.43934 3.43934C2.72064 3.15804 3.10218 3 3.5 3H5.5C5.89782 3 6.27936 3.15804 6.56066 3.43934C6.84196 3.72064 7 4.10218 7 4.5V14M2 14H14M2 14H1M7 14H14M14 14H15M14 14V8.5C14 8.10218 13.842 7.72064 13.5607 7.43934C13.2794 7.15804 12.8978 7 12.5 7H10.5C10.1022 7 9.72064 7.15804 9.43934 7.43934C9.15804 7.72064 9 8.10218 9 8.5V14M5 6H4.5M5 9H4.5M11 10H10.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Understanding Customer's Business</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Buying Intent & Signals')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#666" strokeWidth="1.2"/>
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#666" strokeWidth="1.2"/>
                    <path d="M12.5 3.5L13.5 2.5M3.5 12.5L2.5 13.5M3.5 3.5L2.5 2.5M12.5 12.5L13.5 13.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Buying Intent & Signals</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Value Alignment')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Value Alignment</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Engagement Approach')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.5 5C10.5 5 11 5.5 11 6.5C11 7.5 10.5 8 10.5 8M12.5 3C12.5 3 13.5 4 13.5 6.5C13.5 9 12.5 10 12.5 10M3.5 9V7C3.5 6.60218 3.65804 6.22064 3.93934 5.93934C4.22064 5.65804 4.60218 5.5 5 5.5H6.5L9 3V13L6.5 10.5H5C4.60218 10.5 4.22064 10.342 3.93934 10.0607C3.65804 9.77936 3.5 9.39782 3.5 9Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Engagement Approach</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Today\'s News')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2H11V12H3V2Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V12" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5H9M5 7H9M5 9H7" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Today's News</div>
                </div>
              </button>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            {selectedOption ? (
              /* Two Row Layout - With Selected Option */
              <>
                <input
                  type="text"
                  placeholder="Enter website..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="main-input"
                />
                <div className="bottom-row">
                  <div className="tag-container">
                    <div className="selected-tag">
                      <span>{selectedOption}</span>
                      <button 
                        className="remove-tag-btn"
                        onClick={handleRemoveOption}
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="input-actions">
                    <button className="input-btn" onClick={togglePlusMenu}>
                      <HiPlus size={16} />
                    </button>
                    <button className="input-btn">
                      <HiMicrophone size={16} />
                    </button>
                    <button className="input-btn primary" onClick={handleSubmit}>
                      <HiArrowUp size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Single Row Layout - Default */
              <div className="single-row">
                <input
                  type="text"
                  placeholder="Your Customer's website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="main-input"
                />
                <div className="input-actions">
                  <button className="input-btn" onClick={togglePlusMenu}>
                    <HiPlus size={16} />
                  </button>
                  <button className="input-btn">
                    <HiMicrophone size={16} />
                  </button>
                  <button className="input-btn primary" onClick={handleSubmit}>
                    <HiArrowUp size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLoginClick={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignupClick={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
    </div>
  );
}

export default LandingPage;

