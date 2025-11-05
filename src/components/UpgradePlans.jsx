import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import toast, { Toaster } from 'react-hot-toast';
import logoImage from '../assets/Amplify-Value-as-subtitle-3.png';
import './UpgradePlans.css';

const UpgradePlans = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const personalPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'Forever',
      description: 'For individuals getting started',
      features: [
        'Basic customer insights',
        '5 account searches/month',
        'Basic dashboard access',
        'Email support'
      ],
      buttonText: 'Current Plan',
      buttonDisabled: true,
      highlighted: false,
      primaryButton: false
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      description: 'For professionals who need more',
      features: [
        'Everything in Free',
        'Unlimited AI analysis',
        'Unlimited searches',
        'Advanced analytics',
        'Churn prediction',
        'Meeting coach AI',
        'API access',
        'Priority support'
      ],
      buttonText: 'Upgrade to Professional',
      buttonDisabled: false,
      highlighted: true,
      primaryButton: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: 'per month',
      description: 'For power users',
      features: [
        'Everything in Professional',
        'Custom AI fine-tuning',
        'White-label reports',
        'Dedicated manager',
        'Premium support',
        'Early access features'
      ],
      buttonText: 'Upgrade to Enterprise',
      buttonDisabled: false,
      highlighted: false,
      primaryButton: true
    }
  ];

  // Commented out - not currently used
  // const businessPlans = [
  //   {
  //     name: 'Business Team',
  //     price: '$299',
  //     period: 'per month',
  //     description: 'For small to medium teams',
  //     features: [
  //       'Everything in Enterprise',
  //       'Up to 10 team members',
  //       'Shared workspaces',
  //       'Team collaboration',
  //       'Team analytics',
  //       'Role-based permissions',
  //       'Priority support'
  //     ],
  //     buttonText: 'Contact Sales',
  //     buttonDisabled: false,
  //     highlighted: true
  //   },
  //   {
  //     name: 'Business Enterprise',
  //     price: 'Custom',
  //     period: 'Contact us',
  //     description: 'For large organizations',
  //     features: [
  //       'Everything in Business Team',
  //       'Unlimited team members',
  //       'Custom AI training',
  //       'White-label solution',
  //       'SSO/SAML integration',
  //       'SLA guarantee (99.9%)',
  //       'Dedicated success team'
  //     ],
  //     buttonText: 'Contact Sales',
  //     buttonDisabled: false,
  //     highlighted: false
  //   }
  // ];

  const handleUpgrade = (planName) => {
    if (planName === 'Professional' || planName === 'Enterprise') {
      toast('Redirecting to checkout...', {
        icon: 'ℹ️',
      });
    } else if (planName === 'Business Team' || planName === 'Business Enterprise') {
      toast('Our sales team will contact you shortly.', {
        icon: 'ℹ️',
      });
    }
  };

  const handleLogoClick = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // If logged in, navigate to results page, otherwise to landing page
    if (token && user) {
      navigate('/results');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 24,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: 'rgba(0, 0, 0, 0.85)',
            padding: '10px 16px',
            borderRadius: '2px',
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#52c41a',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4d4f',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
            },
          },
        }}
      />
      <div className="upgrade-plans-page">
        {/* Logo Section */}
        <div className="upgrade-logo-header">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            className="back-button"
            size="large"
          >
            Back
          </Button>
          <img 
            src={logoImage} 
            alt="Value AIM Logo" 
            className="upgrade-logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </div>

      {/* Page Content */}
      <div className="plans-content">
        {/* Page Title */}
        <div className="plans-title-section">
          <h1 className="plans-main-title">Choose Your Plan</h1>
          <p className="plans-main-subtitle">Pricing in USD • Inclusive of all taxes</p>
        </div>

        {/* Personal Plans */}
        <div className="plans-container">
          {/* <h2 className="category-title">Personal</h2> */}
          <div className={`plans-grid ${isMobile ? 'mobile' : ''}`}>
          {personalPlans.map((plan, index) => (
            <div
              key={index}
              className={`plan-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && (
                <div className="plan-badge">MOST POPULAR</div>
              )}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-pricing">
                  <span className="plan-price">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="plan-period">{plan.period}</span>
                  )}
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="plan-feature">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type={plan.primaryButton ? "primary" : "default"}
                size="large"
                block
                disabled={plan.buttonDisabled}
                onClick={() => handleUpgrade(plan.name)}
                className={`plan-button ${plan.primaryButton ? 'primary-button' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Business Plans */}
      {/* <div className="plans-container">
        <h2 className="category-title">Business</h2>
        <div className={`plans-grid business-grid ${isMobile ? 'mobile' : ''}`}>
          {businessPlans.map((plan, index) => (
            <div
              key={index}
              className={`plan-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.highlighted && (
                <div className="plan-badge">RECOMMENDED</div>
              )}
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-pricing">
                  <span className="plan-price">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="plan-period">{plan.period}</span>
                  )}
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="plan-feature">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                type={plan.primaryButton ? "primary" : "default"}
                size="large"
                block
                disabled={plan.buttonDisabled}
                onClick={() => handleUpgrade(plan.name)}
                className={`plan-button ${plan.primaryButton ? 'primary-button' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div> */}

      {/* Footer */}
      <div className="upgrade-footer">
        <p className="footer-text">
          All prices are in USD and inclusive of all taxes. Need a custom solution?{' '}
          <a href="#" className="footer-link">Contact our sales team</a>
        </p>
      </div>
    </div>
    </>
  );
};

export default UpgradePlans;

