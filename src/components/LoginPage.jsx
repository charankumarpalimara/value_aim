import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../utils/api';
import Header from "./Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showOtpOption, setShowOtpOption] = useState(false);
  const [showTryAnotherWay, setShowTryAnotherWay] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Signup state
  const [signupStep, setSignupStep] = useState(1); // 1: email/password, 2: OTP, 3: full name
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupOtp, setSignupOtp] = useState('');
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupProfilePhoto, setSignupProfilePhoto] = useState(null);
  const [signupProfilePhotoPreview, setSignupProfilePhotoPreview] = useState(null);
  const [signupOtpTimer, setSignupOtpTimer] = useState(0);
  const [isSubmittingSignup, setIsSubmittingSignup] = useState(false);
  const [isVerifyingSignupOtp, setIsVerifyingSignupOtp] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingOtpEmail, setIsCheckingOtpEmail] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP errors
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [signupOtpError, setSignupOtpError] = useState(false);
  const [signupOtpErrorMessage, setSignupOtpErrorMessage] = useState('');
  
  // Signup form errors
  const [signupPasswordError, setSignupPasswordError] = useState(false);
  const [signupPasswordErrorMessage, setSignupPasswordErrorMessage] = useState('');
  const [signupConfirmPasswordError, setSignupConfirmPasswordError] = useState(false);
  const [signupConfirmPasswordErrorMessage, setSignupConfirmPasswordErrorMessage] = useState('');
  const [signupFirstNameError, setSignupFirstNameError] = useState(false);
  const [signupFirstNameErrorMessage, setSignupFirstNameErrorMessage] = useState('');
  const [signupLastNameError, setSignupLastNameError] = useState(false);
  const [signupLastNameErrorMessage, setSignupLastNameErrorMessage] = useState('');
  
  // Email restrictions
  const [emailRestricted, setEmailRestricted] = useState(false);
  const [emailRestrictionMessage, setEmailRestrictionMessage] = useState('');

  // Email validation function
  const validateEmailRestrictions = (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    
    // If no domain exists, it's invalid
    if (!domain) {
      setEmailRestricted(true);
      setEmailRestrictionMessage('Please enter a valid email address.');
      return false;
    }
    
    // List of restricted domains (disposable emails, spam domains, etc.)
    const restrictedDomains = [
      // Disposable email services
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
      'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
      'bccto.me', 'chacuo.net', 'dispostable.com', 'mailnesia.com',
      'meltmail.com', 'trashmail.com', 'yopmail.com', 'yopmail.net',
      'yopmail.org', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
      'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
      'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf',
      // Common spam domains
      'spam.com', 'spam.org', 'spam.net', 'spam.info', 'spam.biz',
      'spam.co.uk', 'spam.de', 'spam.fr', 'spam.it', 'spam.es',
      // Test domains
      'test.com', 'example.com', 'sample.com', 'demo.com',
      // Invalid domains
      'localhost', 'invalid', 'test', 'example'
    ];
    
    // Check if domain is restricted
    if (restrictedDomains.includes(domain)) {
      setEmailRestricted(true);
      setEmailRestrictionMessage('This email domain is not allowed. Please use a valid email address.');
      return false;
    }
    
    // Check for suspicious patterns
    if (domain.includes('temp') || domain.includes('fake') || domain.includes('spam')) {
      setEmailRestricted(true);
      setEmailRestrictionMessage('Temporary or suspicious email domains are not allowed.');
      return false;
    }
    
    // Check for valid domain structure
    if (!domain.includes('.')) {
      setEmailRestricted(true);
      setEmailRestrictionMessage('Please enter a valid email address with a proper domain.');
      return false;
    }
    
    setEmailRestricted(false);
    setEmailRestrictionMessage('');
    return true;
  };

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

  const handlePasswordLogin = async () => {
    // Reset errors
    setPasswordError(false);
    setPasswordErrorMessage('');

    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      setPasswordError(true);
      setPasswordErrorMessage('Password is required');
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoggingIn(true);
    try {
      console.log('Checking if user exists:', email);
      
      // First check if user exists
      const checkResponse = await authAPI.checkEmail(email.trim());
      console.log('Email check response:', checkResponse);
      
      if (!checkResponse.exists) {
        setPasswordError(true);
        setPasswordErrorMessage('This user does not exist. Please check your email or sign up for a new account.');
        setIsLoggingIn(false);
      return;
    }

      console.log('User exists, attempting password login');
      
      // User exists, now try password login
      const loginResponse = await authAPI.login({
        email: email.trim(),
        password: password,
        provider: 'email'
      });
      
      if (loginResponse.success) {
        console.log('User logged in successfully:', loginResponse.data);
        
        // Construct full name from firstName and lastName if available
        const displayName = loginResponse.data.firstName && loginResponse.data.lastName 
          ? `${loginResponse.data.firstName} ${loginResponse.data.lastName}` 
          : loginResponse.data.name || email.split('@')[0];
        
        // Store user data in localStorage (with all onboarding status fields)
        localStorage.setItem('user', JSON.stringify({
          ...loginResponse.data,
          name: displayName,
          email: email,
          provider: 'email'
        }));
        
        // Store auth token
        localStorage.setItem('token', loginResponse.data.token);
        
        // Close password modal
        setPassword('');
        
        // Navigate to results page after successful login
          navigate('/results');
        } else {
        throw new Error(loginResponse.message || 'Login failed');
        }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.message && error.message.includes('user does not exist')) {
        setPasswordError(true);
        setPasswordErrorMessage('This user does not exist. Please check your email or sign up for a new account.');
      } else {
        // Set password error state for wrong password
        setPasswordError(true);
        setPasswordErrorMessage('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSendOtpForEmail = async (emailAddress, isResend = false) => {
    setIsSendingOtp(true);
    
    try {
      console.log('Sending OTP to:', emailAddress);
      
      // Call backend API to send OTP
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          purpose: 'login'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (isResend) {
          alert('OTP resent to your email!');
        }
        
        // Reset OTP field
        setOtp('');
        
        // Focus OTP input
        setTimeout(() => document.getElementById('otp-input')?.focus(), 100);
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

  const handleVerifyOtpForEmail = async (emailAddress) => {
    // Reset errors
    setOtpError(false);
    setOtpErrorMessage('');

    if (otp.length !== 6) {
      setOtpError(true);
      setOtpErrorMessage('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      console.log('Verifying OTP:', { email: emailAddress.trim(), otp: otp });

      // Verify OTP
      const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress.trim(),
          otp: otp,
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
        email: emailAddress.trim(),
        provider: 'email',
        otpVerified: true
      });

      if (loginResponse.success) {
        // Construct full name from firstName and lastName if available
        const displayName = loginResponse.data.firstName && loginResponse.data.lastName 
          ? `${loginResponse.data.firstName} ${loginResponse.data.lastName}` 
          : loginResponse.data.name || emailAddress.split('@')[0];
        
        // Store user data (with all onboarding status fields)
        localStorage.setItem('user', JSON.stringify({
          ...loginResponse.data,
          name: displayName,
          email: emailAddress,
          provider: 'email'
        }));

        localStorage.setItem('token', loginResponse.data.token);

        // Close modal and navigate
        setPassword('');
        setOtp('');
        setOtpError(false);
        setOtpErrorMessage('');
        setShowTryAnotherWay(false);
        setShowOtpOption(false);
        setOtpEmail('');

        // Navigate to results page after successful OTP login
        navigate('/results');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setOtpError(true);
      setOtpErrorMessage('Invalid OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
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
          <h2 className="login-title">Log in</h2>
          <p className="login-subtitle">Next Generation AI platform for B2B Sales.</p>

          <div className="email-section">
            {!showTryAnotherWay ? (
              <>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                />
                <div style={{ position: 'relative', marginTop: '12px', width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Reset password error when user starts typing
                      if (passwordError) {
                        setPasswordError(false);
                        setPasswordErrorMessage('');
                      }
                    }}
                    className="email-input"
                    style={{ 
                      width: '100%',
                      paddingRight: '40px',
                      borderColor: passwordError ? '#ff4d4f' : ''
                    }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {passwordErrorMessage && (
                  <div style={{
                    fontSize: '12px',
                    color: '#ff4d4f',
                    marginTop: '4px',
                    marginBottom: '8px'
                  }}>
                    {passwordErrorMessage}
                  </div>
                )}
                <div style={{ marginTop: '12px' }}>
                  <button className="continue-btn" onClick={handlePasswordLogin} disabled={isLoggingIn} style={{ width: '100%', opacity: isLoggingIn ? 0.6 : 1 }}>
                    {isLoggingIn ? 'Logging in...' : 'Log In'}
            </button>
          </div>

                {/* Try another way button */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowTryAnotherWay(true);
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
              </>
            )}

            {/* Try Another Way Section */}
            {showTryAnotherWay && (
              <div style={{ padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                {!showOtpOption ? (
                  <>
                    <p style={{ marginBottom: '16px', color: '#666', textAlign: 'center' }}>
                      Enter your email to receive a verification code
                    </p>

                    <div className="signup-form-group">
            <input
              type="email"
              placeholder="Email address"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        className="signup-input"
                        autoFocus
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!otpEmail.trim()) {
                            alert('Please enter your email address');
                            return;
                          }
                          if (!/\S+@\S+\.\S+/.test(otpEmail)) {
                            alert('Please enter a valid email address');
                            return;
                          }

                          // Check if user exists
                          try {
                            setIsCheckingOtpEmail(true);
                            const checkResponse = await authAPI.checkEmail(otpEmail.trim());
                            if (!checkResponse.exists) {
                              alert('This user does not exist. Please check your email or sign up for a new account.');
                              return;
                            }

                            // User exists, proceed with OTP
                            setShowOtpOption(true);
                            handleSendOtpForEmail(otpEmail);
                          } catch (error) {
                            console.error('Error checking email:', error);
                            alert('An error occurred while checking your email. Please try again.');
                          } finally {
                            setIsCheckingOtpEmail(false);
                          }
                        }}
                        className="signup-submit-btn"
                        style={{ flex: 1 }}
                        type="button"
                        disabled={isCheckingOtpEmail}
                      >
                        {isCheckingOtpEmail ? 'Checking...' : 'Send Code'}
              </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTryAnotherWay(false);
                          setShowOtpOption(false);
                          setOtpEmail('');
                          setOtp('');
                          setOtpError(false);
                          setOtpErrorMessage('');
                        }}
                        className="signup-login-btn"
                        style={{ flex: 1 }}
                        type="button"
                        disabled={isCheckingOtpEmail}
                      >
                        ← Back to password login
                      </button>

            </div>

                  </>
                ) : (
                  <>
                    <p style={{ marginBottom: '16px', color: '#666', textAlign: 'center' }}>
                      Enter the verification code sent to <strong>{otpEmail}</strong>
                    </p>

                    {/* OTP Input Field */}
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        id="otp-input"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                          setOtp(value);
                          // Clear error when user types
                          if (otpError) {
                            setOtpError(false);
                            setOtpErrorMessage('');
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
                          if (pastedData.length <= 6) {
                            setOtp(pastedData);
                          }
                        }}
                        className="signup-input"
                        style={{
                          width: '100%',
                          height: '50px',
                          textAlign: 'center',
                          fontSize: '24px',
                          letterSpacing: '8px',
                          borderColor: otpError ? '#ff4d4f' : ''
                        }}
                        placeholder="000000"
                        autoFocus
                      />
                      {otpErrorMessage && (
                        <div style={{
                          fontSize: '12px',
                          color: '#ff4d4f',
                          marginTop: '4px',
                          textAlign: 'center'
                        }}>
                          {otpErrorMessage}
                        </div>
                      )}
          </div>

                    {/* Resend Button */}
                    <div style={{ marginBottom: '16px' }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSendOtpForEmail(otpEmail, true);
                        }}
                        className="signup-login-btn"
                        style={{ fontSize: '14px', width: '100%' }}
                        type="button"
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend Code'}
                      </button>
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleVerifyOtpForEmail(otpEmail);
                      }}
                      className="signup-submit-btn"
                      style={{ width: '100%', marginTop: '8px' }}
                      type="button"
                      disabled={isVerifyingOtp || otp.length !== 6}
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                    </button>

                    {/* Back to email button */}
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowOtpOption(false);
                          setOtp('');
                          setOtpError(false);
                          setOtpErrorMessage('');
                        }}
                        className="signup-login-btn"
                        style={{ fontSize: '14px' }}
                        type="button"
                      >
                        Back to email
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
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
          setSignupOtp('');
          setSignupFirstName('');
          setSignupLastName('');
          setSignupProfilePhoto(null);
          setSignupProfilePhotoPreview(null);
          setEmailRestricted(false);
          setEmailRestrictionMessage('');
          setSignupOtpError(false);
          setSignupOtpErrorMessage('');
          setSignupFirstNameError(false);
          setSignupFirstNameErrorMessage('');
          setSignupLastNameError(false);
          setSignupLastNameErrorMessage('');
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
                  setSignupOtp('');
                  setSignupFirstName('');
                  setSignupLastName('');
                  setSignupProfilePhoto(null);
                  setSignupProfilePhotoPreview(null);
                  setEmailRestricted(false);
                  setEmailRestrictionMessage('');
                  setSignupOtpError(false);
                  setSignupOtpErrorMessage('');
                  setSignupFirstNameError(false);
                  setSignupFirstNameErrorMessage('');
                  setSignupLastNameError(false);
                  setSignupLastNameErrorMessage('');
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
                      inputMode="email"
                      placeholder="Email Address *"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        setEmailExists(false);
                        setEmailCheckMessage('');
                        setEmailRestricted(false);
                        setEmailRestrictionMessage('');
                      }}
                      onBlur={async () => {
                        if (!signupEmail.trim()) return;
                        
                        // First validate email restrictions
                        if (!validateEmailRestrictions(signupEmail.trim())) {
                          return;
                        }
                        
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
                        borderColor: emailExists || emailRestricted ? '#ff4d4f' : emailCheckMessage === '' && signupEmail && !emailRestricted ? '#52c41a' : ''
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
                    {emailRestrictionMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f',
                        marginTop: '4px'
                      }}>
                        {emailRestrictionMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="signup-form-group" style={{ position: 'relative' }}>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupPasswordError) {
                          setSignupPasswordError(false);
                          setSignupPasswordErrorMessage('');
                        }
                      }}
                      className="signup-input"
                      style={{ 
                        paddingRight: '40px',
                        borderColor: signupPasswordError ? '#ff4d4f' : ''
                      }}
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
                    {signupPasswordErrorMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f',
                        marginTop: '4px'
                      }}>
                        {signupPasswordErrorMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="signup-form-group" style={{ position: 'relative' }}>
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
                      value={signupConfirmPassword}
                      onChange={(e) => {
                        setSignupConfirmPassword(e.target.value);
                        if (signupConfirmPasswordError) {
                          setSignupConfirmPasswordError(false);
                          setSignupConfirmPasswordErrorMessage('');
                        }
                      }}
                      className="signup-input"
                      style={{ 
                        paddingRight: '40px',
                        borderColor: signupConfirmPasswordError ? '#ff4d4f' : ''
                      }}
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
                    {signupConfirmPasswordErrorMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f',
                        marginTop: '4px'
                      }}>
                        {signupConfirmPasswordErrorMessage}
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={async (e) => {
                      e.preventDefault();
                      
                      // Reset all errors
                      setSignupPasswordError(false);
                      setSignupPasswordErrorMessage('');
                      setSignupConfirmPasswordError(false);
                      setSignupConfirmPasswordErrorMessage('');
                      
                      // Validate all fields
                      let hasError = false;
                      
                      if (!signupEmail.trim() || !signupPassword || !signupConfirmPassword) {
                        if (!signupPassword) {
                          setSignupPasswordError(true);
                          setSignupPasswordErrorMessage('Password is required');
                          hasError = true;
                        }
                        if (!signupConfirmPassword) {
                          setSignupConfirmPasswordError(true);
                          setSignupConfirmPasswordErrorMessage('Please confirm your password');
                          hasError = true;
                        }
                        if (!signupEmail.trim()) {
                          alert('Please fill all fields');
                        }
                        if (hasError) return;
                      }
                      
                      if (signupPassword.length < 6) {
                        setSignupPasswordError(true);
                        setSignupPasswordErrorMessage('Password must be at least 6 characters');
                        return;
                      }
                      
                      if (signupPassword !== signupConfirmPassword) {
                        setSignupConfirmPasswordError(true);
                        setSignupConfirmPasswordErrorMessage('Passwords do not match');
                        return;
                      }
                      
                      // Check if email is restricted
                      if (emailRestricted) {
                        alert('This email domain is not allowed. Please use a valid email address.');
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
                          setSignupStep(2);
                          setTimeout(() => document.getElementById('signup-otp-input')?.focus(), 100);
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
                    disabled={isCheckingEmail || emailExists || emailRestricted}
                    style={{ width: '100%', opacity: isCheckingEmail || emailExists || emailRestricted ? 0.6 : 1 }}
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
                  
                  <div style={{ marginBottom: '20px' }}>
                      <input
                      id="signup-otp-input"
                        type="text"
                        inputMode="numeric"
                      maxLength={6}
                      value={signupOtp}
                        onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        setSignupOtp(value);
                        // Clear error when user types
                        if (signupOtpError) {
                          setSignupOtpError(false);
                          setSignupOtpErrorMessage('');
                        }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
                        if (pastedData.length <= 6) {
                          setSignupOtp(pastedData);
                          }
                        }}
                        className="signup-input"
                      style={{
                        width: '100%',
                        height: '50px',
                        textAlign: 'center',
                        fontSize: '24px',
                        letterSpacing: '8px',
                        borderColor: signupOtpError ? '#ff4d4f' : ''
                      }}
                      placeholder="000000"
                      autoFocus
                    />
                    {signupOtpErrorMessage && (
                      <div style={{
                        fontSize: '12px',
                        color: '#ff4d4f',
                        marginTop: '4px',
                        textAlign: 'center'
                      }}>
                        {signupOtpErrorMessage}
                      </div>
                    )}
                  </div>

                    <button
                      onClick={async () => {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/send`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: signupEmail.trim(), purpose: 'accountCreation' })
                        });
                        if (response.ok) {
                        setSignupOtp('');
                          // alert('OTP resent!');
                        }
                      }}
                      className="signup-login-btn"
                    style={{ fontSize: '14px', width: '100%', marginBottom: '16px' }}
                    >
                      Resend Code
                    </button>
                  
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      // Reset errors
                      setSignupOtpError(false);
                      setSignupOtpErrorMessage('');

                      const otpValue = signupOtp;
                      if (otpValue.length !== 6) {
                        setSignupOtpError(true);
                        setSignupOtpErrorMessage('Please enter the complete 6-digit code');
                        return;
                      }
                      
                      setIsVerifyingSignupOtp(true);
                      try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api'}/auth/otp/verify`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: signupEmail.trim(), otp: otpValue, purpose: 'accountCreation' })
                        });
                        const result = await response.json();
                        
                        console.log('OTP Verification Response:', { status: response.status, ok: response.ok, result });
                        
                        if (response.ok && result.success) {
                          console.log('OTP verification successful, proceeding to step 3');
                          setSignupStep(3);
                          setTimeout(() => document.querySelector('.signup-input')?.focus(), 100);
                        } else {
                          console.log('OTP verification failed:', result.message);
                          setSignupOtpError(true);
                          setSignupOtpErrorMessage(result.message || 'Invalid OTP');
                        }
                      } catch (error) {
                        console.error('OTP verification error:', error);
                        setSignupOtpError(true);
                        setSignupOtpErrorMessage('Failed to verify OTP. Please try again.');
                      } finally {
                        setIsVerifyingSignupOtp(false);
                      }
                    }}
                    className="signup-submit-btn"
                    style={{ width: '100%', marginTop: '8px', opacity: isVerifyingSignupOtp ? 0.6 : 1 }}
                    disabled={signupOtp.length !== 6 || isVerifyingSignupOtp}
                  >
                    {isVerifyingSignupOtp ? 'Verifying...' : 'Verify'}
                  </button>
                </>
              )}

              {signupStep === 3 && (
                <>
                  <div className="signup-form-group">
                    <input
                      type="text"
                      placeholder="First Name *"
                      value={signupFirstName}
                      onChange={(e) => {
                        setSignupFirstName(e.target.value);
                        if (signupFirstNameError) {
                          setSignupFirstNameError(false);
                          setSignupFirstNameErrorMessage('');
                        }
                      }}
                      className="signup-input"
                      style={{ 
                        borderColor: signupFirstNameError ? '#ff4d4f' : ''
                      }}
                    />
                    {signupFirstNameErrorMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f',
                        marginTop: '4px'
                      }}>
                        {signupFirstNameErrorMessage}
                      </div>
                    )}
                  </div>
                  
                  <div className="signup-form-group">
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={signupLastName}
                      onChange={(e) => {
                        setSignupLastName(e.target.value);
                        if (signupLastNameError) {
                          setSignupLastNameError(false);
                          setSignupLastNameErrorMessage('');
                        }
                      }}
                      className="signup-input"
                      style={{ 
                        borderColor: signupLastNameError ? '#ff4d4f' : ''
                      }}
                    />
                    {signupLastNameErrorMessage && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#ff4d4f',
                        marginTop: '4px'
                      }}>
                        {signupLastNameErrorMessage}
                      </div>
                    )}
                  </div>

                  <div className="signup-form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '13px', 
                      color: '#666', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Profile Photo (Optional)
                    </label>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #201F47',
                        flexShrink: 0,
                        background: signupProfilePhotoPreview ? 'transparent' : '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {signupProfilePhotoPreview ? (
                          <img 
                            src={signupProfilePhotoPreview} 
                            alt="Preview" 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                          />
                        ) : (
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" stroke="#999" strokeWidth="1.5" fill="none"/>
                            <path d="M6 21C6 17.134 8.68629 14 12 14C15.3137 14 18 17.134 18 21" stroke="#999" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                          </svg>
                        )}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <input
                          type="file"
                          id="login-signup-profile-photo"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (!file.type.startsWith('image/')) {
                                alert('Please select an image file');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                alert('Image size must be less than 5MB');
                                return;
                              }
                              setSignupProfilePhoto(file);
                              setSignupProfilePhotoPreview(URL.createObjectURL(file));
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        <label 
                          htmlFor="login-signup-profile-photo"
                          style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            background: '#f5f5f5',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#333',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#e8e8e8';
                            e.target.style.borderColor = '#201F47';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#f5f5f5';
                            e.target.style.borderColor = '#d9d9d9';
                          }}
                        >
                          {signupProfilePhoto ? 'Change Photo' : 'Choose Photo'}
                        </label>
                        {signupProfilePhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              setSignupProfilePhoto(null);
                              setSignupProfilePhotoPreview(null);
                            }}
                            style={{
                              marginLeft: '8px',
                              padding: '8px 16px',
                              background: 'transparent',
                              border: '1px solid #ff4d4f',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              color: '#ff4d4f',
                              fontWeight: '500',
                              marginTop:"10px"
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      
                      // Reset errors
                      setSignupFirstNameError(false);
                      setSignupFirstNameErrorMessage('');
                      setSignupLastNameError(false);
                      setSignupLastNameErrorMessage('');
                      
                      // Validate first name and last name
                      let hasError = false;
                      
                      if (!signupFirstName.trim()) {
                        setSignupFirstNameError(true);
                        setSignupFirstNameErrorMessage('First name is required');
                        hasError = true;
                      }
                      
                      if (!signupLastName.trim()) {
                        setSignupLastNameError(true);
                        setSignupLastNameErrorMessage('Last name is required');
                        hasError = true;
                      }
                      
                      if (hasError) return;
                      
                      setIsSubmittingSignup(true);
                      try {
                        // Create FormData if there's a profile photo
                        let registrationData;
                        if (signupProfilePhoto) {
                          registrationData = new FormData();
                          registrationData.append('firstName', signupFirstName.trim());
                          registrationData.append('lastName', signupLastName.trim());
                          registrationData.append('name', `${signupFirstName.trim()} ${signupLastName.trim()}`);
                          registrationData.append('email', signupEmail);
                          registrationData.append('password', signupPassword);
                          registrationData.append('provider', 'email');
                          registrationData.append('profileImage', signupProfilePhoto, signupProfilePhoto.name);
                        } else {
                          registrationData = {
                            firstName: signupFirstName.trim(),
                            lastName: signupLastName.trim(),
                            name: `${signupFirstName.trim()} ${signupLastName.trim()}`,
                            email: signupEmail,
                            password: signupPassword,
                            provider: 'email'
                          };
                        }
                        
                        const response = await authAPI.register(registrationData);
                        
                        if (response.success) {
                          // Store complete user data with onboarding status
                          localStorage.setItem('user', JSON.stringify({
                            ...response.data,
                            name: `${signupFirstName.trim()} ${signupLastName.trim()}`,
                            firstName: signupFirstName.trim(),
                            lastName: signupLastName.trim(),
                            email: signupEmail,
                            provider: 'email'
                          }));
                          localStorage.setItem('token', response.data.token);
                          setShowSignupModal(false);
                          setSignupStep(1);
                          // Reset form fields
                          setSignupFirstName('');
                          setSignupLastName('');
                          setSignupProfilePhoto(null);
                          setSignupProfilePhotoPreview(null);
                          navigate('/company-details');
                        }
                      } catch (error) {
                        alert('Registration failed: ' + (error.message || 'Please try again'));
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

    </div>
  );
}

export default LoginPage;
