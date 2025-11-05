import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CompanyDetailsPage from './CompanyDetailsPage';
import ServiceDetailsForm from './ServiceDetailsForm';
import ResultsPage from './ResultsPage';

const FormFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('formFlowData');
    return saved ? JSON.parse(saved) : {
      companyDetails: null,
      serviceDetails: null
    };
  });

  // Check user onboarding status and redirect appropriately
  useEffect(() => {
    const checkOnboardingStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      
      try {
        const user = JSON.parse(storedUser);
        const isNewUser = user.isFirstLogin === true;
        const hasCompletedOnboarding = user.hasCompletedOnboarding === true;
        
        console.log('User onboarding status:', { isNewUser, hasCompletedOnboarding });
        
        // If existing user (not first login) and trying to access onboarding pages
        if (!isNewUser || hasCompletedOnboarding) {
          if (location.pathname === '/company-details' || location.pathname === '/service-details') {
            console.log('Existing user detected, redirecting to results');
            navigate('/results', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [location.pathname, navigate]);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('formFlowData', JSON.stringify(formData));
  }, [formData]);

  const handleCompanyDetailsNext = (companyData) => {
    setFormData(prev => ({ ...prev, companyDetails: companyData }));
    navigate('/service-details');
  };

  const handleServiceDetailsNext = (serviceData) => {
    setFormData(prev => ({ ...prev, serviceDetails: serviceData }));
    navigate('/results');
  };

  const handleServiceDetailsBack = () => {
    navigate('/company-details');
  };

  const handleResultsBack = () => {
    navigate('/service-details');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const renderCurrentPage = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/company-details':
        return <CompanyDetailsPage onNext={handleCompanyDetailsNext} />;
      case '/service-details':
        return (
          <ServiceDetailsForm 
            onNext={handleServiceDetailsNext} 
            onBack={handleServiceDetailsBack}
          />
        );
      case '/results':
        return (
          <ResultsPage 
            formData={formData}
            onBack={handleResultsBack}
            onLogout={handleLogout}
          />
        );
      default:
        return <CompanyDetailsPage onNext={handleCompanyDetailsNext} />;
    }
  };

  return (
    <div>
      {renderCurrentPage()}
    </div>
  );
};

export default FormFlow;
