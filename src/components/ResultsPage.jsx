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
import NotesTab from "./tabs/NotesTab";
import CustomerInsightsTab from "./tabs/CustomerInsightsTab";
import MeetingCoachTab from "./tabs/MeetingCoachTab";
import ChurnPredictionTab from "./tabs/ChurnPredictionTab";
import RevenueLeakTab from "./tabs/RevenueLeakTab";
import AccountPlaybookTab from "./tabs/AccountPlaybookTab";

function ResultsPage() {
  const [website, setWebsite] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    today: false,
    yesterday: false,
    previous: false,
    bankOfAmerica: false,
    cisco: false,
    aig: false
  });
  const [activeTab, setActiveTab] = useState('Journey Matrix');
  const [activeSidebarOption, setActiveSidebarOption] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768);
  const [conversations, setConversations] = useState([]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    avatar: null,
    plan: "Free Plan"
  });

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

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
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

  // Close plus menu and profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlusMenu && !event.target.closest('.search-actions')) {
        setShowPlusMenu(false);
      }
      if (showProfileMenu && !event.target.closest('.profile-section')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu, showProfileMenu]);

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
                    <div className="nav-subtitle" onClick={(e) => {
                      
                      // If clicking the text itself (not the chevron), show tabs
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('Bank of America');
                        // Close sidebar when clicking company name on mobile
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('bankOfAmerica');
                    }}>
                      <span style={{ cursor: 'pointer' }}>Bank of America</span>
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
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
                    </div>
                  </div>

                  {/* Cisco Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={(e) => {
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('Cisco');
                        // Close sidebar when clicking company name on mobile
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('cisco');
                    }}>
                      <span style={{ cursor: 'pointer' }}>Cisco</span>
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
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
                    </div>
                  </div>

                  {/* AIG Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={(e) => {
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('AIG');
                        // Close sidebar when clicking company name on mobile
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('aig');
                    }}>
                      <span style={{ cursor: 'pointer' }}>AIG</span>
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
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
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
              {/* User Profile Section */}
              <div className="profile-section">
                <button className="profile-btn" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="profile-info">
                      <div className="profile-name">{userProfile.name}</div>
                      <div className="profile-email">{userProfile.email}</div>
                    </div>
                  )}
                  {!isSidebarCollapsed && (
                    <svg 
                      className={`profile-chevron ${showProfileMenu ? 'expanded' : ''}`}
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                
                {/* Profile Menu Dropdown */}
                {showProfileMenu && (
                  <div className="profile-menu">
                    <div className="profile-menu-header">
                      <div className="profile-menu-avatar">
                        {userProfile.avatar ? (
                          <img src={userProfile.avatar} alt="Profile" />
                        ) : (
                          <div className="avatar-placeholder">
                            {userProfile.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="profile-menu-info">
                        <div className="profile-menu-name">{userProfile.name}</div>
                        <div className="profile-menu-email">{userProfile.email}</div>
                        <div className="profile-menu-plan">
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px' }}>
                            <path d="M8 1L10.5 5.5L15.5 6L12 9.5L13 14.5L8 12L3 14.5L4 9.5L0.5 6L5.5 5.5L8 1Z" fill="currentColor"/>
                          </svg>
                          {userProfile.plan}
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-divider"></div>
                    
                    <div className="profile-menu-items">
                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13 2L3 12M3 2L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                        <span>Suggestions</span>
                      </button>
                      
                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          <path d="M12.8 10C12.7277 10.2384 12.7224 10.4932 12.7847 10.7349C12.847 10.9766 12.9743 11.1953 13.1533 11.3667L13.1933 11.4067C13.3351 11.5481 13.4472 11.7166 13.5228 11.9022C13.5984 12.0878 13.6361 12.287 13.6361 12.4883C13.6361 12.6897 13.5984 12.8889 13.5228 13.0745C13.4472 13.2601 13.3351 13.4286 13.1933 13.57C13.0519 13.7118 12.8834 13.8239 12.6978 13.8995C12.5122 13.9751 12.313 14.0128 12.1117 14.0128C11.9103 14.0128 11.7111 13.9751 11.5255 13.8995C11.3399 13.8239 11.1714 13.7118 11.03 13.57L10.99 13.53C10.8186 13.351 10.5999 13.2237 10.3582 13.1614C10.1165 13.0991 9.86173 13.1044 9.62333 13.1767C9.39017 13.2444 9.17989 13.3765 9.01849 13.558C8.85709 13.7395 8.75116 13.9631 8.71333 14.2033V14.3333C8.71333 14.7426 8.55107 15.1353 8.26268 15.4237C7.97429 15.7121 7.5816 15.8743 7.17233 15.8743C6.76307 15.8743 6.37038 15.7121 6.08199 15.4237C5.7936 15.1353 5.63133 14.7426 5.63133 14.3333V14.27C5.58736 14.0223 5.47349 13.7923 5.30278 13.6064C5.13207 13.4205 4.91157 13.2861 4.66667 13.2183C4.42827 13.146 4.17345 13.1513 3.93177 13.2336C3.69009 13.3159 3.47142 13.4705 3.3 13.68L3.26 13.72C3.11857 13.8618 2.95011 13.9739 2.76451 14.0495C2.57891 14.1251 2.37968 14.1628 2.17833 14.1628C1.97699 14.1628 1.77776 14.1251 1.59216 14.0495C1.40656 13.9739 1.2381 13.8618 1.09667 13.72C0.954838 13.5786 0.842753 13.4101 0.767141 13.2245C0.691528 13.0389 0.653809 12.8397 0.653809 12.6383C0.653809 12.437 0.691528 12.2378 0.767141 12.0522C0.842753 11.8666 0.954838 11.6981 1.09667 11.5567L1.13667 11.5167C1.34713 11.3452 1.5017 11.1266 1.58396 10.8849C1.66623 10.6432 1.67151 10.3884 1.59967 10.15C1.532 9.91684 1.39987 9.70656 1.21839 9.54516C1.03691 9.38376 0.813302 9.27783 0.573 9.24V9.2C0.163735 9.2 -0.228955 9.03774 -0.517345 8.74935C-0.805735 8.46096 -0.968 8.06827 -0.968 7.659C-0.968 7.24974 -0.805735 6.85705 -0.517345 6.56866C-0.228955 6.28027 0.163735 6.118 0.573 6.118H0.636333C0.884054 6.07403 1.11402 5.96016 1.29994 5.78945C1.48586 5.61874 1.62024 5.39824 1.688 5.15333C1.76033 4.91493 1.75505 4.66011 1.67279 4.41843C1.59052 4.17676 1.43595 3.95809 1.2265 3.78667L1.18667 3.74667C1.04484 3.60524 0.932753 3.43678 0.857141 3.25118C0.781528 3.06558 0.743809 2.86635 0.743809 2.665C0.743809 2.46366 0.781528 2.26443 0.857141 2.07883C0.932753 1.89323 1.04484 1.72477 1.18667 1.58333C1.3281 1.4415 1.49656 1.32942 1.68216 1.25381C1.86776 1.17819 2.06699 1.14048 2.26833 1.14048C2.46968 1.14048 2.66891 1.17819 2.85451 1.25381C3.04011 1.32942 3.20857 1.4415 3.35 1.58333L3.39 1.62333C3.56142 1.83279 3.78009 1.98736 4.02177 2.06963C4.26345 2.15189 4.51827 2.15717 4.75667 2.08483H4.79667C5.02983 2.0171 5.24011 1.88497 5.40151 1.70349C5.56291 1.52201 5.66884 1.2984 5.70667 1.05817V0.928333C5.70667 0.519068 5.86893 0.126378 6.15732 -0.162011C6.44571 -0.450401 6.8384 -0.612667 7.24767 -0.612667C7.65693 -0.612667 8.04962 -0.450401 8.33801 -0.162011C8.6264 0.126378 8.78867 0.519068 8.78867 0.928333V0.991667C8.8265 1.2319 8.93243 1.45551 9.09383 1.63699C9.25523 1.81847 9.46551 1.9506 9.69867 2.01833C9.93707 2.09067 10.1919 2.08539 10.4336 2.00312C10.6752 1.92086 10.8939 1.76629 11.0653 1.55683L11.1053 1.51683C11.2468 1.375 11.4152 1.26292 11.6008 1.1873C11.7864 1.11169 11.9857 1.07397 12.187 1.07397C12.3883 1.07397 12.5876 1.11169 12.7732 1.1873C12.9588 1.26292 13.1272 1.375 13.2687 1.51683C13.4105 1.65827 13.5226 1.82673 13.5982 2.01233C13.6738 2.19793 13.7115 2.39716 13.7115 2.5985C13.7115 2.79985 13.6738 2.99908 13.5982 3.18468C13.5226 3.37028 13.4105 3.53874 13.2687 3.68017L13.2287 3.72017C13.0192 3.89159 12.8646 4.11026 12.7824 4.35193C12.7001 4.59361 12.6948 4.84843 12.7667 5.08683V5.12683C12.8344 5.35999 12.9665 5.57027 13.148 5.73167C13.3295 5.89307 13.5531 5.999 13.7933 6.03683H13.9233C14.3326 6.03683 14.7253 6.1991 15.0137 6.48749C15.302 6.77588 15.4643 7.16857 15.4643 7.57783C15.4643 7.9871 15.302 8.37979 15.0137 8.66818C14.7253 8.95657 14.3326 9.11883 13.9233 9.11883H13.86C13.6198 9.15666 13.3962 9.26259 13.2147 9.42399C13.0332 9.58539 12.9011 9.79567 12.8333 10.0288V10.0288Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                        <span>Setting</span>
                      </button>
                      
                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                          <path d="M8 4V8M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>Help</span>
                      </button>
                      
                      <div className="profile-menu-divider"></div>
                      
                      <button className="profile-menu-item logout">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11.3333L14 8L10 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
          <div className="content-area">
            {/* Show 6 tabs when clicking company name text (Bank of America, Cisco, AIG) */}
            {['Bank of America', 'Cisco', 'AIG'].includes(activeSidebarOption) && (
              <div className="insights-container">
                <div className="insights-header">
                  <h2 className="page-title">{activeSidebarOption}</h2>
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

            {/* Show individual screens when clicking submenu items */}
            {activeSidebarOption === 'Insights' && (
              <CustomerInsightsTab />
            )}

            {activeSidebarOption === 'Account Playbook' && (
              <AccountPlaybookTab />
            )}

            {activeSidebarOption === 'Meet Coach' && (
              <MeetingCoachTab />
            )}

            {activeSidebarOption === 'Churn Prediction' && (
              <ChurnPredictionTab />
            )}

            {activeSidebarOption === 'Revenue Leak' && (
              <RevenueLeakTab />
            )}

            {activeSidebarOption === 'Notes' && (
              <NotesTab />
            )}
          </div>

          <div className={`search-box-bottom ${isSidebarCollapsed ? 'expanded' : ''}`}>
            <div className="search-box">
              <input
                type="text"
                placeholder="You Customer's website"
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

