import React, { useState, useEffect } from "react";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import logoImage from "../assets/Amplify-Value-as-subtitle-3.png";
import "./ResultsPage.css";
import "./ResultsPage-tabs.css";
import JourneyMatrixTab from "./tabs/JourneyMatrixTab";
import BusinessOpportunityTab from "./tabs/BusinessOpportunityTab";
import PartnershipTab from "./tabs/PartnershipTab";
import BusinessValueTab from "./tabs/BusinessValueTab";
import CompetitorTab from "./tabs/CompetitorTab";
import BusinessReviewTab from "./tabs/BusinessReviewTab";

function ResultsPage() {
  const [website, setWebsite] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    today: true,
    yesterday: false,
    previous: false,
    bankOfAmerica: false,
    cisco: false,
    aig: false
  });
  const [activeTab, setActiveTab] = useState('Journey Matrix');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
  const [conversations, setConversations] = useState([]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (website.trim()) {
      // Create new conversation entry
      const newConversation = {
        id: Date.now(),
        title: website.trim(),
        createdAt: new Date().toISOString()
      };

      // Add to conversations list (newest first)
      setConversations(prev => [newConversation, ...prev]);

      // Clear input
      setWebsite("");

      console.log("Created conversation:", newConversation);
    } else {
      alert("Please enter a question or website URL");
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

  const handleNewChat = () => {
    setWebsite("");
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  const handleAddConversation = (title) => {
    const newConversation = {
      id: Date.now(),
      title: title,
      createdAt: new Date().toISOString()
    };

    setConversations(prev => [newConversation, ...prev]);
    setShowPlusMenu(false);
    console.log("Added conversation:", newConversation);
  };

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlusMenu && !event.target.closest('.search-actions')) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu]);

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
            
            <button className="new-chat" onClick={handleNewChat}>
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
                  {/* Bank of America Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={() => toggleSection('bankOfAmerica')}>
                      <span>Bank of America</span>
                      <svg 
                        className={`chevron ${expandedSections.bankOfAmerica ? 'expanded' : ''}`} 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.bankOfAmerica ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${['Insights', 'Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].includes(activeTab) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Journey Matrix'); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeTab === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Account Playbook'); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeTab === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Meet Coach'); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeTab === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Churn Prediction'); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeTab === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Revenue Leak'); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeTab === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Notes'); }}>Notes</a>
                    </div>
                  </div>

                  {/* Cisco Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={() => toggleSection('cisco')}>
                      <span>Cisco</span>
                      <svg 
                        className={`chevron ${expandedSections.cisco ? 'expanded' : ''}`} 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.cisco ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${['Insights', 'Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].includes(activeTab) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Journey Matrix'); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeTab === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Account Playbook'); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeTab === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Meet Coach'); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeTab === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Churn Prediction'); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeTab === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Revenue Leak'); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeTab === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Notes'); }}>Notes</a>
                    </div>
                  </div>

                  {/* AIG Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={() => toggleSection('aig')}>
                      <span>AIG</span>
                      <svg 
                        className={`chevron ${expandedSections.aig ? 'expanded' : ''}`} 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.aig ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${['Insights', 'Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].includes(activeTab) ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Journey Matrix'); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeTab === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Account Playbook'); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeTab === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Meet Coach'); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeTab === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Churn Prediction'); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeTab === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Revenue Leak'); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeTab === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('Notes'); }}>Notes</a>
                    </div>
                  </div>
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
                  {/* Dynamically render conversations */}
                  {conversations.length === 0 ? (
                    <div style={{ padding: '8px 12px', color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
                      No conversations yet. Enter a question above.
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <a 
                        key={conv.id} 
                        href="#" 
                        className="nav-item"
                        onClick={(e) => { e.preventDefault(); console.log('Clicked:', conv.title); }}
                      >
                        {conv.title}
                      </a>
                    ))
                  )}
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
          <div className="content-area">
            {/* Show Insights Tabs */}
            {['Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].includes(activeTab) && (
              <div className="insights-container">
                <div className="insights-header">
                  <h2 className="page-title">Organization Insights</h2>
                  <p className="page-subtitle">Comprehensive view of your organization's performance and opportunities</p>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                  <div className="tab-nav-container">
                    {['Journey Matrix', 'Business Opportunity', 'Partnership', 'Business Value', 'Competitor', 'Business Review'].map((tab) => (
                      <button
                        key={tab}
                        className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content-wrapper">
                  {activeTab === 'Journey Matrix' && <JourneyMatrixTab mobile={isMobile} tablet={isTablet} />}
                  {activeTab === 'Business Opportunity' && <BusinessOpportunityTab mobile={isMobile} tablet={isTablet} />}
                  {activeTab === 'Partnership' && <PartnershipTab mobile={isMobile} tablet={isTablet} />}
                  {activeTab === 'Business Value' && <BusinessValueTab mobile={isMobile} tablet={isTablet} />}
                  {activeTab === 'Competitor' && <CompetitorTab mobile={isMobile} tablet={isTablet} />}
                  {activeTab === 'Business Review' && <BusinessReviewTab mobile={isMobile} tablet={isTablet} />}
                </div>
              </div>
            )}

            {/* Other Tabs Content */}
            {activeTab === 'Account Playbook' && (
              <div className="default-content">
                <h2>Account Playbook</h2>
                <p>Strategic playbook for account management coming soon...</p>
              </div>
            )}

            {activeTab === 'Meet Coach' && (
              <div className="default-content">
                <h2>Meet Coach</h2>
                <p>AI-powered coaching features coming soon...</p>
              </div>
            )}

            {activeTab === 'Churn Prediction' && (
              <div className="default-content">
                <h2>Churn Prediction</h2>
                <p>Predictive analytics for customer retention coming soon...</p>
              </div>
            )}

            {activeTab === 'Revenue Leak' && (
              <div className="default-content">
                <h2>Revenue Leak Analysis</h2>
                <p>Identify and prevent revenue leakage coming soon...</p>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="default-content">
                <h2>Notes</h2>
                <p>Collaborative note-taking features coming soon...</p>
              </div>
            )}
          </div>

          <div className="search-box-bottom">
            <div className="search-box">
              <input
                type="text"
                placeholder="Enter Customer's Website or Ask a Question"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
              <div className="search-actions">
                <div style={{ position: 'relative' }}>
                  <button className="search-btn" onClick={togglePlusMenu}>
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
                        onClick={() => handleAddConversation('Sales Pipeline Analysis')}
                      >
                        <span className="menu-item-icon">📊</span>
                        <div className="menu-item-content">
                          <div className="menu-item-title">Sales Pipeline Analysis</div>
                          <div className="menu-item-desc">Analyze your sales pipeline</div>
                        </div>
                      </button>
                      <button 
                        className="plus-menu-item"
                        onClick={() => handleAddConversation('Competitor Analysis')}
                      >
                        <span className="menu-item-icon">🎯</span>
                        <div className="menu-item-content">
                          <div className="menu-item-title">Competitor Analysis</div>
                          <div className="menu-item-desc">Compare with competitors</div>
                        </div>
                      </button>
                      <button 
                        className="plus-menu-item"
                        onClick={() => handleAddConversation('Revenue Forecasting')}
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
