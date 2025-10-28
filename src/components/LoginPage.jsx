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
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      alert('Please enter your password');
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Reset password error state
    setPasswordError(false);
    setPasswordErrorMessage('');

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
    if (otp.length !== 6) {
      alert('Please enter the complete 6-digit code');
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
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          name: loginResponse.data.name || emailAddress.split('@')[0],
          email: emailAddress,
          provider: 'email',
          plan: loginResponse.data.plan || 'Free Plan'
        }));

        localStorage.setItem('token', loginResponse.data.token);

        // Close modal and navigate
        setPassword('');
        setOtp('');
        setShowTryAnotherWay(false);
        setShowOtpOption(false);
        setOtpEmail('');

        // Navigate to results page after successful OTP login
        navigate('/results');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
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
                <input
                  type="password"
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
                  style={{ marginTop: '12px' }}
                />
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
                          letterSpacing: '8px'
                        }}
                        placeholder="000000"
                        autoFocus
                      />
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
          setEmailRestricted(false);
          setEmailRestrictionMessage('');
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
                  setEmailRestricted(false);
                  setEmailRestrictionMessage('');
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
                        letterSpacing: '8px'
                      }}
                      placeholder="000000"
                      autoFocus
                    />
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
                          alert('OTP resent!');
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
                      const otpValue = signupOtp;
                      if (otpValue.length !== 6) {
                        alert('Please enter the complete 6-digit code');
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
                          alert(result.message || 'Invalid OTP');
                        }
                      } catch (error) {
                        console.error('OTP verification error:', error);
                        alert('Failed to verify OTP. Please try again.');
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
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      className="signup-input"
                      autoFocus
                    />
                  </div>
                  
                  <div className="signup-form-group">
                    <input
                      type="text"
                      placeholder="Last Name *"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      className="signup-input"
                    />
                  </div>
                  
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!signupFirstName.trim() || !signupLastName.trim()) {
                        alert('Please enter both first name and last name');
                        return;
                      }
                      
                      setIsSubmittingSignup(true);
                      try {
                        const response = await authAPI.register({
                          firstName: signupFirstName.trim(),
                          lastName: signupLastName.trim(),
                          name: `${signupFirstName.trim()} ${signupLastName.trim()}`, // Keep full name for backward compatibility
                          email: signupEmail,
                          password: signupPassword,
                          provider: 'email'
                        });
                        
                        if (response.success) {
                          localStorage.setItem('user', JSON.stringify({
                            name: `${signupFirstName.trim()} ${signupLastName.trim()}`,
                            firstName: signupFirstName.trim(),
                            lastName: signupLastName.trim(),
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

    </div>
  );
}

export default LoginPage;
