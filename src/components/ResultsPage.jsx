import React, { useState } from "react";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
import "./ResultsPage.css";

function ResultsPage() {
  const [website, setWebsite] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    today: true,
    yesterday: true,
    previous: true
  });

  const opportunities = [
    { id: 1, opportunity: "abcdefg", urgency: "High", description: "Wewe wew ew sss dsdssd sdsdsds...", contact: "Unlock Playbook" },
    { id: 2, opportunity: "hijklmn", urgency: "Medium", description: "Wewe wew ew sss dsdssd sdsdsds...", contact: "Unlock Playbook" },
    { id: 3, opportunity: "opqrstu", urgency: "Low", description: "Wewe wew ew sss dsdssd sdsdsds...", contact: "Unlock Playbook" }
  ];

  const handleSubmit = () => {
    if (website.trim()) {
      console.log("Processing website:", website);
      alert(`Searching for: ${website}`);
    } else {
      alert("Please enter a website URL");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="results-page">
      {/* Header */}
      <header className="page-header">
        <img src={logoImage} alt="Logo" className="header-logo" />
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* <div className="header-actions">
          <button className="action-btn">Upgrade</button>
          <button className="action-btn primary">Request a Demo</button>
        </div> */}
      </header>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Main Container */}
      <div className="page-container">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="collapse-btn-desktop" onClick={toggleSidebarCollapse} aria-label="Toggle sidebar">
            {isSidebarCollapsed ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L13 10L7 16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 4L7 10L13 16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          
          <div className="sidebar-inner">
            <div className="sidebar-top">
              <img src={logoImage} alt="Logo" className="sidebar-logo" />
              <div className="sidebar-icon-collapsed">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="28" height="28" rx="4" fill="#201F47"/>
                  <text x="16" y="20" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle">V</text>
                </svg>
              </div>
              <button className="close-btn" onClick={closeSidebar} aria-label="Close sidebar">×</button>
            </div>
            
            <button className="new-chat">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              New chat
            </button>

            <nav className="sidebar-nav">
              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('today')}>
                  <span>Today</span>
                  <svg 
                    className={`chevron ${expandedSections.today ? 'expanded' : ''}`} 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.today ? 'expanded' : ''}`}>
                  <a href="#" className="nav-item active">B2B Sales Analysis</a>
                  <a href="#" className="nav-item">Market Research</a>
                </div>
              </div>

              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('yesterday')}>
                  <span>Yesterday</span>
                  <svg 
                    className={`chevron ${expandedSections.yesterday ? 'expanded' : ''}`} 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.yesterday ? 'expanded' : ''}`}>
                  <a href="#" className="nav-item">Lead Generation Strategy</a>
                  <a href="#" className="nav-item">Customer Segmentation</a>
                </div>
              </div>

              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('previous')}>
                  <span>Previous 7 days</span>
                  <svg 
                    className={`chevron ${expandedSections.previous ? 'expanded' : ''}`} 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.previous ? 'expanded' : ''}`}>
                  <a href="#" className="nav-item">Sales Pipeline Analysis</a>
                  <a href="#" className="nav-item">Competitor Analysis</a>
                  <a href="#" className="nav-item">Revenue Forecasting</a>
                </div>
              </div>
            </nav>

            <div className="sidebar-bottom">
              <button className="upgrade-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L10.5 5.5L15.5 6L12 9.5L13 14.5L8 12L3 14.5L4 9.5L0.5 6L5.5 5.5L8 1Z" fill="currentColor"/>
                </svg>
                Upgrade 
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
          {/* <h1 className="page-title">B2B SALES ADVISOR</h1> */}
          
          <div className="content-area">
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Urgency</th>
                    <th>Description</th>
                    <th>Potential Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((opp) => (
                    <tr key={opp.id}>
                      <td>{opp.opportunity}</td>
                      <td>
                        <span className={`badge badge-${opp.urgency.toLowerCase()}`}>
                          {opp.urgency}
                        </span>
                      </td>
                      <td>{opp.description}</td>
                      <td>
                        <button className="table-btn">{opp.contact}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="search-box-bottom">
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter Customer's Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <div className="search-actions">
                <button className="search-btn"><HiPlus size={20} /></button>
                <button className="search-btn"><HiMicrophone size={20} /></button>
                <button className="search-btn submit" onClick={handleSubmit}><HiArrowUp size={20} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResultsPage;
