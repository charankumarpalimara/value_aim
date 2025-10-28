import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AutoLogin Component
 * Automatically logs in users if they have a valid token (within 7 days)
 * and redirects them to the appropriate page based on their onboarding status
 */
const AutoLogin = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== AUTO LOGIN CHECK ===');
      console.log('Current path:', location.pathname);
      
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      console.log('Token exists:', !!token);
      console.log('User exists:', !!userStr);
      console.log('Token expiration:', tokenExpiration);

      // If no token or token expired, clear everything
      if (!token || (tokenExpiration && new Date(tokenExpiration) < new Date())) {
        console.log('Token missing or expired, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        setIsChecking(false);
        return;
      }

      // If token exists and not expired, redirect based on onboarding status
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log('User data:', user);
          
          // Only auto-redirect from landing or login pages
          if (location.pathname === '/' || location.pathname === '/login') {
            console.log('On landing/login page, checking redirect conditions...');
            
            // Auto-redirect based on onboarding status
            if (user.hasCompletedOnboarding) {
              console.log('Redirecting to /results (completed onboarding)');
              navigate('/results', { replace: true });
            } else if (user.serviceDetailsCompleted) {
              console.log('Redirecting to /results (service details completed)');
              navigate('/results', { replace: true });
            } else if (user.companyDetailsCompleted) {
              console.log('Redirecting to /service-details (company details completed)');
              navigate('/service-details', { replace: true });
            } else if (user.isFirstLogin) {
              console.log('Redirecting to /company-details (first login)');
              navigate('/company-details', { replace: true });
            } else {
              console.log('No redirect condition met, staying on current page');
              console.log('User status:', {
                hasCompletedOnboarding: user.hasCompletedOnboarding,
                serviceDetailsCompleted: user.serviceDetailsCompleted,
                companyDetailsCompleted: user.companyDetailsCompleted,
                isFirstLogin: user.isFirstLogin
              });
            }
          } else {
            console.log('Not on landing/login page, skipping redirect');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          // If user data is corrupted, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
        }
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return children;
};

export default AutoLogin;

