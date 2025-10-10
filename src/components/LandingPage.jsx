import React, { useState } from "react";
import Header from "./Header";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import "./LandingPage.css";

function LandingPage({ onNavigate }) {
  const [website, setWebsite] = useState("");

  const handleSubmit = () => {
    if (website.trim()) {
      onNavigate('login');
    }
  };

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
            <button className="input-btn"><HiPlus size={20} /></button>
            <button className="input-btn"><HiMicrophone size={20} /></button>
            <button className="input-btn primary" onClick={handleSubmit}><HiArrowUp size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
