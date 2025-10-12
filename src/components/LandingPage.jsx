import React, { useState, useEffect } from "react";
import Header from "./Header";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import "./LandingPage.css";

function LandingPage({ onNavigate }) {
  const [website, setWebsite] = useState("");
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  const handleSubmit = () => {
    if (website.trim()) {
      onNavigate('login');
    }
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  const handleAddOption = (title) => {
    console.log("Added:", title);
    setShowPlusMenu(false);
    // You can add additional logic here if needed
  };

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlusMenu && !event.target.closest('.input-actions')) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu]);

  return (
    <div className="landing-page">
      <Header onNavigate={onNavigate} />
      
      <div className="landing-content">
        <h1 className="main-heading">Research your customer</h1>
        <div className="input-section">
          <input
            type="text"
            placeholder="Your Customer's website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="main-input"
          />
          <div className="input-actions">
            <div style={{ position: 'relative' }}>
              <button className="input-btn" onClick={togglePlusMenu}>
                <HiPlus size={20} />
              </button>
              
              {/* Plus Menu Popup */}
              {showPlusMenu && (
                <div className="plus-menu-popup">
                  <div className="plus-menu-header">
                    <span>Add to Analysis</span>
                  </div>
                  <button 
                    className="plus-menu-item"
                    onClick={() => handleAddOption('Sales Pipeline Analysis')}
                  >
                    <span className="menu-item-icon">📊</span>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Sales Pipeline Analysis</div>
                      <div className="menu-item-desc">Analyze your sales pipeline</div>
                    </div>
                  </button>
                  <button 
                    className="plus-menu-item"
                    onClick={() => handleAddOption('Competitor Analysis')}
                  >
                    <span className="menu-item-icon">🎯</span>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Competitor Analysis</div>
                      <div className="menu-item-desc">Compare with competitors</div>
                    </div>
                  </button>
                  <button 
                    className="plus-menu-item"
                    onClick={() => handleAddOption('Revenue Forecasting')}
                  >
                    <span className="menu-item-icon">💰</span>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Revenue Forecasting</div>
                      <div className="menu-item-desc">Predict future revenue</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
            <button className="input-btn"><HiMicrophone size={20} /></button>
            <button className="input-btn primary" onClick={handleSubmit}><HiArrowUp size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
