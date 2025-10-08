import React, { useState } from "react";
import Header from "./Header";
import { MicrosoftLogo, GoogleLogo, AppleLogo, AmazonLogo, MetaLogo } from "./BrandLogos";
import "./CompanyDetailsPage.css";

function CompanyDetailsPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    location: "",
    employees: "",
    description: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onNavigate('results');
  };

  return (
    <div className="company-page">
      <Header onNavigate={onNavigate} />
      
      <div className="company-content">
        <div className="company-card">
          <h2 className="company-title">Company Details</h2>
          <p className="company-subtitle">Enter your company information below.</p>
          
          {/* <div className="company-icons-section">
            <p className="icons-label">Trusted by leading companies:</p>
            <div className="company-icons">
              <div className="company-icon"><MicrosoftLogo /></div>
              <div className="company-icon"><AppleLogo /></div>
              <div className="company-icon"><GoogleLogo /></div>
              <div className="company-icon"><AmazonLogo /></div>
              <div className="company-icon"><MetaLogo /></div>
            </div>
          </div> */}
          
          <div className="form-grid">
            <input
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Industry (e.g. IT, Finance)"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="form-input"
            />
            <input
              type="url"
              placeholder="Website (https://example.com)"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Location (City, Country)"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="form-input"
            />
            <select
              value={formData.employees}
              onChange={(e) => handleInputChange('employees', e.target.value)}
              className="form-select"
            >
              <option value="">Number of Employees</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-1000">201-1000</option>
              <option value="1000+">1000+</option>
            </select>
            <textarea
              placeholder="Short Company Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="form-textarea"
              rows="3"
            />
          </div>

          <button className="save-btn" onClick={handleSave}>Save Details</button>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailsPage;
