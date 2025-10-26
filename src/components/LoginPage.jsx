import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { GOOGLE_CLIENT_ID, MICROSOFT_CONFIG, APPLE_CONFIG } from '../config';
import { authAPI } from '../utils/api';
import Header from "./Header";
import { GoogleLogo, MicrosoftLogo, AppleLogo } from "./BrandLogos";
import { FaPhone } from "react-icons/fa";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [username, setUsername] = useState("");
  const [googleUserData, setGoogleUserData] = useState(null);
  const [loginProvider, setLoginProvider] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showOtpOption, setShowOtpOption] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Debug: Monitor password modal state
  useEffect(() => {
    console.log('Password modal state changed:', showPasswordModal);
    if (showPasswordModal === false) {
      console.trace('Modal closed - stack trace:');
    }
  }, [showPasswordModal]);

  // Google Login Handler
  const handleGoogleLogin = () => {
    // Check if Google Client ID is configured
    if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com' || !GOOGLE_CLIENT_ID) {
      alert('⚠️ Google OAuth Setup Required\n\n' +
            'To enable Google login:\n\n' +
            '1. Go to https://console.cloud.google.com/\n' +
            '2. Create a project and get OAuth credentials\n' +
            '3. Copy your Client ID\n' +
            '4. Update GOOGLE_CLIENT_ID in src/config.js\n\n' +
            'See GOOGLE_OAUTH_SETUP.md for detailed instructions.\n\n' +
            'For now, you can continue with email login below.');
      return;
    }
    
    // Trigger Google login
    googleLogin();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        // Get user info from Google
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
          },
        });
        
        console.log('Google User Info:', res.data);
        
        // Store Google data temporarily and show username prompt
        setGoogleUserData(res.data);
        setUsername(res.data.name || ''); // Pre-fill with Google name
        setLoginProvider('google');
        setShowUsernamePrompt(true);
      } catch (err) {
        console.error('Error fetching user info:', err);
        alert('Failed to get user information. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert('Google login failed. Please check your OAuth configuration.');
    },
  });

  const handleUsernameSubmit = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      // Prepare user data for backend
      const userData = {
        name: username,
        email: googleUserData.email,
        picture: googleUserData.picture,
        provider: loginProvider,
        plan: 'Free Plan',
        providerId: googleUserData.sub,
        firstName: googleUserData.given_name || '',
        lastName: googleUserData.family_name || '',
        isEmailVerified: googleUserData.email_verified || false
      };

      // Try to login first to check if user exists
      try {
        console.log('Attempting OAuth login with:', {
          email: googleUserData.email,
          provider: loginProvider,
          providerId: googleUserData.sub,
          name: username,
          picture: googleUserData.picture
        });
        
        const loginResponse = await authAPI.login({
          email: googleUserData.email,
          provider: loginProvider,
          providerId: googleUserData.sub,
          name: username,
          picture: googleUserData.picture // Send Google profile picture URL
        });
        
        if (loginResponse.success) {
          console.log('User logged in successfully:', loginResponse.data);
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({
            name: username,
            email: googleUserData.email,
            avatar: googleUserData.picture, // Store Google picture
            picture: loginResponse.data.picture, // Store backend picture URL
            provider: loginProvider,
            plan: loginResponse.data.plan || 'Free Plan'
          }));
          
          // Store auth token
          localStorage.setItem('token', loginResponse.data.token);
          
          // Check if user has completed onboarding
          if (loginResponse.data.hasCompletedOnboarding) {
            // Navigate to results page
            navigate('/results');
          } else if (loginResponse.data.companyDetailsCompleted) {
            // Navigate to service details
            navigate('/service-details');
          } else {
            // Navigate to company details
            navigate('/company-details');
          }
          return;
        }
      } catch {
        console.log('User does not exist, proceeding with registration');
      }

      // If login fails, register the user
      console.log('Attempting OAuth registration with:', userData);
      
      const response = await authAPI.register(userData);
      
      if (response.success) {
        console.log('User registered successfully:', response.data);
        console.log('User picture saved:', response.data.picture);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: username,
          email: googleUserData.email,
          avatar: googleUserData.picture, // Store Google picture
          picture: response.data.picture, // Store backend picture URL
          provider: loginProvider,
          plan: 'Free Plan'
        }));
        
        // Store auth token
        localStorage.setItem('token', response.data.token);
        
        // Navigate to company details for new users
        navigate('/company-details');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Failed to authenticate user. Please try again.');
    }
  };

  const handleCancelUsername = () => {
    setShowUsernamePrompt(false);
    setUsername('');
    setGoogleUserData(null);
    setLoginProvider('');
  };

  // Microsoft Login Handler
  const handleMicrosoftLogin = async () => {
    // Check if Microsoft Client ID is configured
    if (MICROSOFT_CONFIG.clientId === 'YOUR_MICROSOFT_CLIENT_ID_HERE' || !MICROSOFT_CONFIG.clientId) {
      alert('⚠️ Microsoft OAuth Setup Required\n\n' +
            'To enable Microsoft login:\n\n' +
            '1. Go to https://portal.azure.com/\n' +
            '2. Register an application in Azure Active Directory\n' +
            '3. Copy your Application (client) ID\n' +
            '4. Update MICROSOFT_CONFIG in src/config.js\n\n' +
            'For now, you can continue with email login below.');
      return;
    }

    // Microsoft OAuth 2.0 implicit flow
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${MICROSOFT_CONFIG.clientId}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(MICROSOFT_CONFIG.redirectUri)}` +
      `&scope=openid%20profile%20email` +
      `&response_mode=fragment`;

    // Open Microsoft login in popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      authUrl,
      'Microsoft Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the OAuth callback
    const checkPopup = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkPopup);
          return;
        }

        if (popup.location.href.includes(MICROSOFT_CONFIG.redirectUri)) {
          const hash = popup.location.hash;
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');

          if (accessToken) {
            popup.close();
            clearInterval(checkPopup);
            
            // Get user info from Microsoft Graph API
            axios.get('https://graph.microsoft.com/v1.0/me', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then(res => {
              console.log('Microsoft User Info:', res.data);
              
              // Store Microsoft data temporarily and show username prompt
              setGoogleUserData({
                name: res.data.displayName,
                email: res.data.mail || res.data.userPrincipalName,
                picture: null, // Microsoft doesn't provide picture in basic scope
              });
              setUsername(res.data.displayName || '');
              setLoginProvider('microsoft');
              setShowUsernamePrompt(true);
            })
            .catch(err => {
              console.error('Error fetching Microsoft user info:', err);
              alert('Failed to get user information. Please try again.');
            });
          }
        }
      } catch {
        // Cross-origin error - popup is still on Microsoft's domain
      }
    }, 500);
  };

  // Apple Login Handler
  const handleAppleLogin = async () => {
    // Check if Apple Client ID is configured
    if (APPLE_CONFIG.clientId === 'YOUR_APPLE_CLIENT_ID_HERE' || !APPLE_CONFIG.clientId) {
      alert('⚠️ Apple OAuth Setup Required\n\n' +
            'To enable Apple login:\n\n' +
            '1. Go to https://developer.apple.com/\n' +
            '2. Create a Service ID in Certificates, Identifiers & Profiles\n' +
            '3. Configure Sign in with Apple\n' +
            '4. Copy your Service ID\n' +
            '5. Update APPLE_CONFIG in src/config.js\n\n' +
            'For now, you can continue with email login below.');
      return;
    }

    try {
      // Load Apple Sign In SDK if not already loaded
      if (!window.AppleID) {
        await loadAppleSDK();
      }

      // Initialize Apple Sign In
      window.AppleID.auth.init({
        clientId: APPLE_CONFIG.clientId,
        scope: APPLE_CONFIG.scope,
        redirectURI: APPLE_CONFIG.redirectUri,
        usePopup: APPLE_CONFIG.usePopup,
      });

      // Sign in with Apple
      const data = await window.AppleID.auth.signIn();
      console.log('Apple Sign In Response:', data);

      // Extract user information
      const idToken = data.authorization.id_token;
      const userInfo = parseJwt(idToken);
      
      // Apple provides name only on first sign-in
      const userName = data.user?.name 
        ? `${data.user.name.firstName} ${data.user.name.lastName}`
        : userInfo.email?.split('@')[0] || 'Apple User';

      // Store Apple data temporarily and show username prompt
      setGoogleUserData({
        name: userName,
        email: userInfo.email,
        picture: null, // Apple doesn't provide profile picture
      });
      setUsername(userName);
      setLoginProvider('apple');
      setShowUsernamePrompt(true);

    } catch (error) {
      console.error('Apple Sign In Error:', error);
      if (error.error !== 'popup_closed_by_user') {
        alert('Apple login failed. Please try again.');
      }
    }
  };

  // Helper function to load Apple Sign In SDK
  const loadAppleSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.AppleID) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Helper function to parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  };

  const handleContinue = async () => {
    console.log('handleContinue called');
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      console.log('Checking if user exists:', email);
      
      // Check if user exists by trying to login without password
      // If user exists, API will return error asking for password
      await authAPI.login({
        email: email.trim(),
        provider: 'email'
      });
      
      // If no error, user might not exist
      console.log('Email not found in database');
      
      const shouldSignup = window.confirm(
        'User not found. Would you like to sign up with this email?\n\n' +
        'Click "OK" to create a new account or "Cancel" to try a different email.'
      );
      
      if (shouldSignup) {
        setSignupData(prev => ({ ...prev, email: email.trim() }));
        setShowSignupModal(true);
      }
    } catch (error) {
      // If error occurs, check if it's because password is required (user exists)
      const errorMessage = error?.response?.data?.message || error?.message || '';
      
      if (errorMessage.toLowerCase().includes('password') || 
          errorMessage.toLowerCase().includes('credential') ||
          error.response?.status === 400 || 
          error.response?.status === 401) {
        // User exists, show password modal
        console.log('User exists, showing password modal');
        console.log('About to set showPasswordModal to true');
        setShowPasswordModal(true);
        console.log('Password modal should be open now, showPasswordModal:', true);
      } else {
        // Other error, assume user doesn't exist
        console.log('Email not found in database');
        
        const shouldSignup = window.confirm(
          'User not found. Would you like to sign up with this email?\n\n' +
          'Click "OK" to create a new account or "Cancel" to try a different email.'
        );
        
        if (shouldSignup) {
          setSignupData(prev => ({ ...prev, email: email.trim() }));
          setShowSignupModal(true);
        }
      }
    }
  };

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      alert('Please enter your password');
      return;
    }

    try {
      console.log('Attempting password login');
      
      const loginResponse = await authAPI.login({
        email: email.trim(),
        password: password,
        provider: 'email'
      });
      
      if (loginResponse.success) {
        console.log('User logged in successfully:', loginResponse.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: loginResponse.data.name || email.split('@')[0],
          email: email,
          provider: 'email',
          plan: loginResponse.data.plan || 'Free Plan'
        }));
        
        // Store auth token
        localStorage.setItem('token', loginResponse.data.token);
        
        // Close password modal
        setShowPasswordModal(false);
        setPassword('');
        
        // Check if user has completed onboarding
        if (loginResponse.data.hasCompletedOnboarding) {
          navigate('/results');
        } else if (loginResponse.data.companyDetailsCompleted) {
          navigate('/service-details');
        } else {
          navigate('/company-details');
        }
      } else {
        throw new Error(loginResponse.message || 'Login failed');
      }
    } catch {
      console.error('Password login failed');
      alert('Invalid password. Please try again.');
    }
  };

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    
    try {
      console.log('Sending OTP to:', email);
      
      // Call backend API to send OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          purpose: 'login'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('OTP sent to your email! Please check your inbox.');
        
        // Store email and navigate to OTP screen
        localStorage.setItem('otpEmail', email.trim());
        setShowPasswordModal(false);
        navigate('/otp');
      } else {
        throw new Error(result.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Signup functions
  const handleSignupInputChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (signupErrors[field]) {
      setSignupErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignupSubmit = async () => {
    const newErrors = {};
    
    if (!signupData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setSignupErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSigningUp(true);
    
    try {
      const response = await authAPI.register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        provider: 'email'
      });
      
      if (response.success) {
        console.log('User registered successfully:', response.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          provider: 'email',
          plan: 'Free Plan'
        }));
        
        // Store auth token
        localStorage.setItem('token', response.data.token);
        
        // Navigate to company details
        navigate('/company-details');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  // const handleBack = () => {
  //   navigate('/');
  // };

  return (
    <div className="login-page">
      <Header onSignupClick={() => setShowSignupModal(true)} />
      
      <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">Log in or sign up</h2>
          <p className="login-subtitle">Smarter responses & file uploads available.</p>
          
          <div className="social-login">
            <button className="social-btn google-btn" onClick={handleGoogleLogin}>
              <span className="social-icon"><GoogleLogo /></span>
              Google
            </button>
            <button className="social-btn microsoft-btn" onClick={handleMicrosoftLogin}>
              <span className="social-icon"><MicrosoftLogo /></span>
              Microsoft
            </button>
            <button className="social-btn apple-btn" onClick={handleAppleLogin}>
              <span className="social-icon"><AppleLogo /></span>
              Apple
            </button>
            <button className="social-btn phone-btn" onClick={() => alert('Phone login coming soon!')}>
              <span className="social-icon"><FaPhone /></span>
              Phone
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="email-section">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* <button 
                className="continue-btn" 
                onClick={handleBack}
                style={{ background: '#f0f0f0', color: '#201F47', flex: '0 0 100px' }}
              >
                Back
              </button> */}
              <button className="continue-btn" onClick={handleContinue} style={{ flex: 1 }}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="signup-modal-overlay" onClick={() => setShowSignupModal(false)}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signup-modal-header">
              <h3>Sign Up</h3>
              <button 
                className="signup-close-btn" 
                onClick={() => setShowSignupModal(false)}
              >
                ×
              </button>
            </div>
            
            <form className="signup-form" onSubmit={(e) => { e.preventDefault(); handleSignupSubmit(); }}>
              <div className="signup-form-group">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={signupData.name}
                  onChange={(e) => handleSignupInputChange('name', e.target.value)}
                  className="signup-input"
                />
                {signupErrors.name && (
                  <div className="signup-error">{signupErrors.name}</div>
                )}
              </div>
              
              <div className="signup-form-group">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange('email', e.target.value)}
                  className="signup-input"
                />
                {signupErrors.email && (
                  <div className="signup-error">{signupErrors.email}</div>
                )}
              </div>
              
              <div className="signup-form-group">
                <input
                  type="password"
                  placeholder="Password *"
                  value={signupData.password}
                  onChange={(e) => handleSignupInputChange('password', e.target.value)}
                  className="signup-input"
                />
                {signupErrors.password && (
                  <div className="signup-error">{signupErrors.password}</div>
                )}
              </div>
              
              <div className="signup-form-group">
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={signupData.confirmPassword}
                  onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                  className="signup-input"
                />
                {signupErrors.confirmPassword && (
                  <div className="signup-error">{signupErrors.confirmPassword}</div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="signup-submit-btn"
                disabled={isSigningUp}
              >
                {isSigningUp ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="signup-login-link">
                Already have an account? 
                <button 
                  type="button" 
                  className="signup-login-btn"
                  onClick={() => {
                    setShowSignupModal(false);
                    // Focus on email input
                    setTimeout(() => {
                      const emailInput = document.querySelector('.email-input');
                      if (emailInput) emailInput.focus();
                    }, 100);
                  }}
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="signup-modal-overlay" onClick={(e) => {
          console.log('Overlay clicked, target:', e.target, 'currentTarget:', e.currentTarget);
          if (e.target === e.currentTarget) {
            console.log('Closing modal from overlay click');
            setShowPasswordModal(false);
            setPassword('');
            setShowOtpOption(false);
          }
        }}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signup-modal-header">
              <h3>Enter Password</h3>
              <button 
                className="signup-close-btn" 
                onClick={() => { setShowPasswordModal(false); setPassword(''); setShowOtpOption(false); }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <p style={{ marginBottom: '16px', color: '#666' }}>
                Please enter your password for <strong>{email}</strong>
              </p>
              
              {!showOtpOption ? (
                <>
                  <div className="signup-form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="signup-input"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordLogin()}
                    />
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePasswordLogin();
                    }}
                    className="signup-submit-btn"
                    style={{ width: '100%' }}
                    type="button"
                  >
                    Log In
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOtpOption(true);
                      }}
                      className="signup-login-btn"
                      style={{ fontSize: '14px' }}
                      type="button"
                    >
                      Try another way
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ marginBottom: '16px', color: '#666' }}>
                      We'll send a verification code to your email
                    </p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSendOtp();
                      }}
                      className="signup-submit-btn"
                      disabled={isSendingOtp}
                      style={{ width: '100%' }}
                      type="button"
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOtpOption(false);
                      }}
                      className="signup-login-btn"
                      style={{ fontSize: '14px' }}
                      type="button"
                    >
                      Back to password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="username-modal-overlay">
          <div className="username-modal">
            <div className="username-modal-header">
              <h3>Choose Your Username</h3>
              <p>Please enter a username to continue</p>
            </div>
            
            {googleUserData && googleUserData.picture && (
              <div className="google-user-info">
                <img src={googleUserData.picture} alt="Profile" className="google-avatar" />
                <p className="google-email">{googleUserData.email}</p>
              </div>
            )}

            <div className="username-input-section">
              <label htmlFor="username-input">Username</label>
              <input
                id="username-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-input"
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                autoFocus
              />
            </div>

            <div className="username-modal-actions">
              <button className="username-cancel-btn" onClick={handleCancelUsername}>
                Cancel
              </button>
              <button className="username-submit-btn" onClick={handleUsernameSubmit}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
