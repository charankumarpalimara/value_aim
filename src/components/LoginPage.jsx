import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { GOOGLE_CLIENT_ID, MICROSOFT_CONFIG, APPLE_CONFIG } from '../config';
import { authAPI } from '../utils/api';
import Header from "./Header";
import { GoogleLogo, MicrosoftLogo, AppleLogo } from "./BrandLogos";
import { FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Signup state
  const [signupStep, setSignupStep] = useState(1); // 1: email/password, 2: OTP, 3: full name
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupOtp, setSignupOtp] = useState(['', '', '', '', '', '']);
  const [signupFullName, setSignupFullName] = useState('');
  const [signupOtpTimer, setSignupOtpTimer] = useState(0);
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isCheckingEmailExistence, setIsCheckingEmailExistence] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Debug: Monitor password modal state
  useEffect(() => {
    console.log('Password modal state changed:', showPasswordModal);
    if (showPasswordModal === false) {
      console.trace('Modal closed - stack trace:');
    }
  }, [showPasswordModal]);

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Signup OTP timer countdown
  useEffect(() => {
    if (signupOtpTimer > 0) {
      const timer = setTimeout(() => setSignupOtpTimer(signupOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [signupOtpTimer]);

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      document.getElementById('otp-5')?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifyingOtp(true);
    
    try {
      console.log('Verifying OTP:', { email: email.trim(), otp: otpValue });
      
      // Verify OTP
      const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpValue,
          purpose: 'login'
        })
      });
      
      const verifyResult = await verifyResponse.json();
      console.log('OTP verification response:', verifyResult, 'Status:', verifyResponse.status);
      
      if (!verifyResponse.ok || !verifyResult.success) {
        throw new Error(verifyResult.message || 'Invalid or expired OTP');
      }

      // OTP verified, now login with otpVerified flag
      const loginResponse = await authAPI.login({
        email: email.trim(),
        provider: 'email',
        otpVerified: true
      });
      
      if (loginResponse.success) {
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          name: loginResponse.data.name || email.split('@')[0],
          email: email,
          provider: 'email',
          plan: loginResponse.data.plan || 'Free Plan'
        }));
        
        localStorage.setItem('token', loginResponse.data.token);
        
        // Close modal and navigate
        setShowPasswordModal(false);
        setPassword('');
        setOtp(['', '', '', '', '', '']);
        setOtpTimer(0);
        
        if (loginResponse.data.hasCompletedOnboarding) {
          navigate('/results');
        } else if (loginResponse.data.companyDetailsCompleted) {
          navigate('/service-details');
        } else {
          navigate('/company-details');
        }
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

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

    setIsCheckingEmailExistence(true);
    try {
      console.log('Checking if user exists:', email);
      
      // Use dedicated check-email API to verify if user exists
      const checkResponse = await authAPI.checkEmail(email.trim());
      console.log('Email check response:', checkResponse);
      
      if (checkResponse.exists) {
        // User exists, show password modal
        console.log('User exists, showing password modal');
        setShowPasswordModal(true);
      } else {
        // User doesn't exist, offer signup
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
    } catch (error) {
      console.error('Error checking email:', error);
      alert('An error occurred while checking your email. Please try again.');
    } finally {
      setIsCheckingEmailExistence(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!password.trim()) {
      alert('Please enter your password');
      return;
    }

    setIsLoggingIn(true);
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
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOtp = async (isResend = false) => {
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
        if (isResend) {
          alert('OTP resent to your email!');
        }
        
        // Reset OTP fields and start timer
        setOtp(['', '', '', '', '', '']);
        setOtpTimer(300); // 5 minutes
        
        // Focus first OTP input
        setTimeout(() => document.getElementById('otp-0')?.focus(), 100);
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
              <button className="continue-btn" onClick={handleContinue} disabled={isCheckingEmailExistence} style={{ flex: 1, opacity: isCheckingEmailExistence ? 0.6 : 1 }}>
                {isCheckingEmailExistence ? 'Checking...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal - Multi Step */}
      {showSignupModal && (
        <div className="signup-modal-overlay" onClick={() => {
          setShowSignupModal(false);
          setSignupStep(1);
          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirmPassword('');
          setSignupOtp(['', '', '', '', '', '']);
          setSignupFullName('');
          setSignupOtpTimer(0);
        }}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signup-modal-header">
              <h3>{signupStep === 1 ? 'Create Account' : signupStep === 2 ? 'Verify Email' : 'Complete Profile'}</h3>
              <button 
                className="signup-close-btn" 
                onClick={() => {
                  setShowSignupModal(false);
                  setSignupStep(1);
                  setSignupEmail('');
                  setSignupPassword('');
                  setSignupConfirmPassword('');
                  setSignupOtp(['', '', '', '', '', '']);
                  setSignupFullName('');
                  setSignupOtpTimer(0);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="signup-form">
              {signupStep === 1 && (
                <>
                  <div className="signup-form-group">
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        setEmailExists(false);
                        setEmailCheckMessage('');
                      }}
                      onBlur={async () => {
                        if (!signupEmail.trim()) return;
                        
                        setIsCheckingEmail(true);
                        setEmailCheckMessage('Checking...');
                        try {
                          // Check if email exists using dedicated API
                          const result = await authAPI.checkEmail(signupEmail.trim());
                          if (result.exists) {
                            setEmailExists(true);
                            setEmailCheckMessage('User already exists with this email');
                          } else {
                            setEmailExists(false);
                            setEmailCheckMessage('Email available');
                          }
                        } catch (error) {
                          console.error('Email check error:', error);
                          setEmailExists(false);
                          setEmailCheckMessage('');
                        } finally {
                          setIsCheckingEmail(false);
                        }
                      }}
                      className="signup-input"
                      autoFocus
                      style={{ 
                        borderColor: emailExists ? '#ff4d4f' : emailCheckMessage === '' && signupEmail ? '#52c41a' : ''
                      }}
                    />
                    {emailCheckMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: emailExists ? '#ff4d4f' : '#52c41a',
                        marginTop: '4px'
                      }}>
                        {emailCheckMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="signup-form-group" style={{ position: 'relative' }}>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="signup-input"
                      style={{ paddingRight: '40px' }}
                    />
                    <span
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '18px'
                      }}
                    >
                      {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  
                  <div className="signup-form-group" style={{ position: 'relative' }}>
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="signup-input"
                      style={{ paddingRight: '40px' }}
                    />
                    <span
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#666',
                        fontSize: '18px'
                      }}
                    >
                      {showSignupConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!signupEmail.trim() || !signupPassword || !signupConfirmPassword) {
                        alert('Please fill all fields');
                        return;
                      }
                      if (signupPassword !== signupConfirmPassword) {
                        alert('Passwords do not match');
                        return;
                      }
                      if (signupPassword.length < 6) {
                        alert('Password must be at least 6 characters');
                        return;
                      }
                      
                      // Check if email already exists
                      if (emailExists) {
                        alert('This email is already registered. Please use a different email or log in.');
                        return;
                      }
                      
                      setIsCheckingEmail(true);
                      try {
                        // User doesn't exist, send OTP
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: signupEmail.trim(), purpose: 'accountCreation' })
                        });
                        const result = await response.json();
                        if (result.success) {
                          setSignupOtpTimer(300);
                          setSignupStep(2);
                          setTimeout(() => document.getElementById('signup-otp-0')?.focus(), 100);
                        } else {
                          alert('Failed to send OTP');
                        }
                      } catch {
                        alert('Failed to send OTP');
                      } finally {
                        setIsCheckingEmail(false);
                      }
                    }}
                    className="signup-submit-btn"
                    disabled={isCheckingEmail || emailExists}
                    style={{ width: '100%', opacity: isCheckingEmail || emailExists ? 0.6 : 1 }}
                  >
                    {isCheckingEmail ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>
                </>
              )}

              {signupStep === 2 && (
                <>
                  <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    Enter the verification code sent to <strong>{signupEmail}</strong>
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                    {signupOtp.map((digit, index) => (
                      <input
                        key={index}
                        id={`signup-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          if (e.target.value.length > 1) return;
                          const newOtp = [...signupOtp];
                          newOtp[index] = e.target.value;
                          setSignupOtp(newOtp);
                          if (e.target.value && index < 5) {
                            document.getElementById(`signup-otp-${index + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !signupOtp[index] && index > 0) {
                            document.getElementById(`signup-otp-${index - 1}`)?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text').trim();
                          if (/^\d{6}$/.test(pastedData)) {
                            setSignupOtp(pastedData.split(''));
                            document.getElementById('signup-otp-5')?.focus();
                          }
                        }}
                        className="signup-input"
                        style={{ width: '40px', height: '50px', textAlign: 'center', fontSize: '24px', padding: '0' }}
                      />
                    ))}
                  </div>

                  {signupOtpTimer > 0 && (
                    <div style={{ textAlign: 'center', marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                      Code expires in {Math.floor(signupOtpTimer / 60)}:{(signupOtpTimer % 60).toString().padStart(2, '0')}
                    </div>
                  )}

                  {signupOtpTimer === 0 && (
                    <button
                      onClick={async () => {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: signupEmail.trim(), purpose: 'accountCreation' })
                        });
                        if (response.ok) {
                          setSignupOtpTimer(300);
                          setSignupOtp(['', '', '', '', '', '']);
                          alert('OTP resent!');
                        }
                      }}
                      className="signup-login-btn"
                      style={{ fontSize: '14px', width: '100%' }}
                    >
                      Resend Code
                    </button>
                  )}
                  
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      const otpValue = signupOtp.join('');
                      if (otpValue.length !== 6) {
                        alert('Please enter the complete 6-digit code');
                        return;
                      }
                      
                      try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/verify`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: signupEmail.trim(), otp: otpValue, purpose: 'accountCreation' })
                        });
                        const result = await response.json();
                        if (result.success) {
                          setSignupStep(3);
                          setTimeout(() => document.querySelector('.signup-input')?.focus(), 100);
                        } else {
                          alert('Invalid OTP');
                        }
                      } catch {
                        alert('Invalid OTP');
                      }
                    }}
                    className="signup-submit-btn"
                    style={{ width: '100%', marginTop: '8px' }}
                    disabled={signupOtp.join('').length !== 6}
                  >
                    Verify
                  </button>
                </>
              )}

              {signupStep === 3 && (
                <>
                  <div className="signup-form-group">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      className="signup-input"
                      autoFocus
                    />
                  </div>
                  
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!signupFullName.trim()) {
                        alert('Please enter your full name');
                        return;
                      }
                      
                      setIsSubmittingSignup(true);
                      try {
                        const response = await authAPI.register({
                          name: signupFullName,
                          email: signupEmail,
                          password: signupPassword,
                          provider: 'email'
                        });
                        
                        if (response.success) {
                          localStorage.setItem('user', JSON.stringify({
                            name: signupFullName,
                            email: signupEmail,
                            provider: 'email',
                            plan: 'Free Plan'
                          }));
                          localStorage.setItem('token', response.data.token);
                          setShowSignupModal(false);
                          setSignupStep(1);
                          navigate('/company-details');
                        }
                      } catch {
                        alert('Registration failed');
                      } finally {
                        setIsSubmittingSignup(false);
                      }
                    }}
                    className="signup-submit-btn"
                    disabled={isSubmittingSignup}
                    style={{ width: '100%' }}
                  >
                    {isSubmittingSignup ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </>
              )}
              
              <div className="signup-login-link">
                Already have an account? 
                <button 
                  type="button" 
                  className="signup-login-btn"
                  onClick={() => {
                    setShowSignupModal(false);
                    setSignupStep(1);
                  }}
                >
                  Log in
                </button>
              </div>
            </div>
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
            setOtp(['', '', '', '', '', '']);
            setOtpTimer(0);
          }
        }}>
          <div className="signup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signup-modal-header">
              <h3>Enter Password</h3>
              <button 
                className="signup-close-btn" 
                onClick={() => { 
                  setShowPasswordModal(false); 
                  setPassword(''); 
                  setShowOtpOption(false);
                  setOtp(['', '', '', '', '', '']);
                  setOtpTimer(0);
                }}
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
                    disabled={isLoggingIn}
                    style={{ width: '100%', opacity: isLoggingIn ? 0.6 : 1 }}
                    type="button"
                  >
                    {isLoggingIn ? 'Logging in...' : 'Log In'}
                  </button>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOtpOption(true);
                        handleSendOtp(); // Automatically send OTP when clicking "Try another way"
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
                  <div style={{ padding: '20px 0' }}>
                    <p style={{ marginBottom: '16px', color: '#666', textAlign: 'center' }}>
                      Enter the verification code sent to <strong>{email}</strong>
                    </p>
                    
                    {/* OTP Input Fields */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={index === 0 ? handleOtpPaste : undefined}
                          className="signup-input"
                          style={{ 
                            width: '40px', 
                            height: '50px', 
                            textAlign: 'center', 
                            fontSize: '24px',
                            padding: '0'
                          }}
                        />
                      ))}
                    </div>

                    {/* Timer */}
                    {otpTimer > 0 && (
                      <div style={{ textAlign: 'center', marginBottom: '16px', color: '#666', fontSize: '14px' }}>
                        Code expires in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                      </div>
                    )}

                    {/* Resend Button */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {otpTimer === 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSendOtp(true);
                          }}
                          className="signup-login-btn"
                          style={{ fontSize: '14px', flex: 1 }}
                          type="button"
                          disabled={isSendingOtp}
                        >
                          {isSendingOtp ? 'Sending...' : 'Resend Code'}
                        </button>
                      )}
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleVerifyOtp();
                      }}
                      className="signup-submit-btn"
                      style={{ width: '100%', marginTop: '8px' }}
                      type="button"
                      disabled={isVerifyingOtp || otp.join('').length !== 6}
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowOtpOption(false);
                        setOtp(['', '', '', '', '', '']);
                        setOtpTimer(0);
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
