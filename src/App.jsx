import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import FormFlow from "./components/FormFlow";
import "./styles/global.css";
import "antd/dist/reset.css";

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
        return <FormFlow />;
      case 'results':
        return <FormFlow />;
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
