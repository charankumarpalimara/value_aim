import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import CompanyDetailsPage from "./components/CompanyDetailsPage";
import ResultsPage from "./components/ResultsPage";
import "./styles/global.css";

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'login':
        return <LoginPage onNavigate={navigateTo} />;
      case 'company-details':
        return <CompanyDetailsPage onNavigate={navigateTo} />;
      case 'results':
        return <ResultsPage />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentPage()}
    </div>
  );
}
