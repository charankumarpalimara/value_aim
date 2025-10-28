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
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      // If no token or token expired, clear everything
      if (!token || (tokenExpiration && new Date(tokenExpiration) < new Date())) {
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
          
          // Only auto-redirect from landing or login pages
          if (location.pathname === '/' || location.pathname === '/login') {
            // Auto-redirect based on onboarding status
            if (user.hasCompletedOnboarding) {
              navigate('/results', { replace: true });
            } else if (user.serviceDetailsCompleted) {
              navigate('/results', { replace: true });
            } else if (user.companyDetailsCompleted) {
              navigate('/service-details', { replace: true });
            } else if (user.isFirstLogin) {
              navigate('/company-details', { replace: true });
            }
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

