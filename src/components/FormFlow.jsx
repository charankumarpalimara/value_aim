import React, { useState } from 'react';
import CompanyDetailsPage from './CompanyDetailsPage';
import ServiceDetailsForm from './ServiceDetailsForm';
import ResultsPage from './ResultsPage';

const FormFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyDetails: null,
    serviceDetails: null
  });

  const handleCompanyDetailsNext = (companyData) => {
    setFormData(prev => ({ ...prev, companyDetails: companyData }));
    setCurrentStep(2);
  };

  const handleCompanyDetailsNavigate = (destination) => {
    if (destination === 'results') {
      setCurrentStep(2); // Go to Service Details instead of directly to results
    }
  };

  const handleServiceDetailsNext = (serviceData) => {
    setFormData(prev => ({ ...prev, serviceDetails: serviceData }));
    setCurrentStep(3);
  };

  const handleServiceDetailsBack = () => {
    setCurrentStep(1);
  };

  const handleResultsBack = () => {
    setCurrentStep(2);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyDetailsPage onNavigate={handleCompanyDetailsNavigate} />;
      case 2:
        return (
          <ServiceDetailsForm 
            onNext={handleServiceDetailsNext} 
            onBack={handleServiceDetailsBack}
          />
        );
      case 3:
        return (
          <ResultsPage 
            formData={formData}
            onBack={handleResultsBack}
          />
        );
      default:
        return <CompanyDetailsPage onNavigate={handleCompanyDetailsNavigate} />;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
    </div>
  );
};

export default FormFlow;
