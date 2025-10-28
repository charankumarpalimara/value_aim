import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { HiPlus, HiMicrophone, HiArrowUp } from "react-icons/hi2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../utils/api";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [website, setWebsite] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  
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
  
  // Signup form errors
  const [signupPasswordError, setSignupPasswordError] = useState(false);
  const [signupPasswordErrorMessage, setSignupPasswordErrorMessage] = useState('');
  const [signupConfirmPasswordError, setSignupConfirmPasswordError] = useState(false);
  const [signupConfirmPasswordErrorMessage, setSignupConfirmPasswordErrorMessage] = useState('');
  
  // Email restrictions
  const [emailRestricted, setEmailRestricted] = useState(false);
  const [emailRestrictionMessage, setEmailRestrictionMessage] = useState('');
  
  const menuRef = useRef(null);

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

  const handleSubmit = () => {
    if (website.trim() || selectedOption) {
      navigate('/login');
    }
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
  };

  const handleAddOption = (title) => {
    setSelectedOption(title);
    setShowPlusMenu(false);
  };

  const handleRemoveOption = () => {
    setSelectedOption(null);
  };

  // Signup OTP timer countdown
  useEffect(() => {
    if (signupOtpTimer > 0) {
      const timer = setTimeout(() => setSignupOtpTimer(signupOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [signupOtpTimer]);

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPlusMenu && menuRef.current && !menuRef.current.contains(event.target) 
          && !event.target.closest('.input-btn')) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlusMenu]);

  return (
    <div className="landing-page">
      <Header onSignupClick={() => setShowSignupModal(true)} />
      
      <div className="landing-content">
        <h1 className="main-heading">Research your customer</h1>
        
        <div className="input-container">
          {/* Plus Menu - Always positioned above input */}
          {showPlusMenu && (
            <div ref={menuRef} className="plus-menu-popup">
              <div className="plus-menu-header">
                <span>Add to Analysis</span>
              </div>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Understanding Customer\'s Business')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14V4.5C2 4.10218 2.15804 3.72064 2.43934 3.43934C2.72064 3.15804 3.10218 3 3.5 3H5.5C5.89782 3 6.27936 3.15804 6.56066 3.43934C6.84196 3.72064 7 4.10218 7 4.5V14M2 14H14M2 14H1M7 14H14M14 14H15M14 14V8.5C14 8.10218 13.842 7.72064 13.5607 7.43934C13.2794 7.15804 12.8978 7 12.5 7H10.5C10.1022 7 9.72064 7.15804 9.43934 7.43934C9.15804 7.72064 9 8.10218 9 8.5V14M5 6H4.5M5 9H4.5M11 10H10.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Understanding Customer's Business</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Buying Intent & Signals')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#666" strokeWidth="1.2"/>
                    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#666" strokeWidth="1.2"/>
                    <path d="M12.5 3.5L13.5 2.5M3.5 12.5L2.5 13.5M3.5 3.5L2.5 2.5M12.5 12.5L13.5 13.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Buying Intent & Signals</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Value Alignment')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Value Alignment</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Engagement Approach')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.5 5C10.5 5 11 5.5 11 6.5C11 7.5 10.5 8 10.5 8M12.5 3C12.5 3 13.5 4 13.5 6.5C13.5 9 12.5 10 12.5 10M3.5 9V7C3.5 6.60218 3.65804 6.22064 3.93934 5.93934C4.22064 5.65804 4.60218 5.5 5 5.5H6.5L9 3V13L6.5 10.5H5C4.60218 10.5 4.22064 10.342 3.93934 10.0607C3.65804 9.77936 3.5 9.39782 3.5 9Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Engagement Approach</div>
                </div>
              </button>
              <button 
                className="plus-menu-item"
                onClick={() => handleAddOption('Today\'s News')}
              >
                <span className="menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 2H11V12H3V2Z" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 4H13C13.2652 4 13.5196 4.10536 13.7071 4.29289C13.8946 4.48043 14 4.73478 14 5V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V12" stroke="#666" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5H9M5 7H9M5 9H7" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                <div className="menu-item-content">
                  <div className="menu-item-title">Today's News</div>
                </div>
              </button>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            {selectedOption ? (
              /* Two Row Layout - With Selected Option */
              <>
                <input
                  type="text"
                  placeholder="Enter website..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="main-input"
                />
                <div className="bottom-row">
                  <div className="tag-container">
                    <div className="selected-tag">
                      <span>{selectedOption}</span>
                      <button 
                        className="remove-tag-btn"
                        onClick={handleRemoveOption}
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="input-actions">
                    <button className="input-btn" onClick={togglePlusMenu}>
                      <HiPlus size={16} />
                    </button>
                    <button className="input-btn">
                      <HiMicrophone size={16} />
                    </button>
                    <button className="input-btn primary" onClick={handleSubmit}>
                      <HiArrowUp size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Single Row Layout - Default */
              <div className="single-row">
                <input
                  type="text"
                  placeholder="Your Customer's website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="main-input"
                />
                <div className="input-actions">
                  <button className="input-btn" onClick={togglePlusMenu}>
                    <HiPlus size={16} />
                  </button>
                  <button className="input-btn">
                    <HiMicrophone size={16} />
                  </button>
                  <button className="input-btn primary" onClick={handleSubmit}>
                    <HiArrowUp size={16} />
                  </button>
                </div>
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
                      
                      if (emailExists) {
                        alert('This email is already registered. Please use a different email or log in.');
                        return;
                      }
                      
                      setIsCheckingEmail(true);
                      try {
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
                          id="signup-profile-photo"
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
                          htmlFor="signup-profile-photo"
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
                      if (!signupFirstName.trim() || !signupLastName.trim()) {
                        alert('Please enter both first name and last name');
                        return;
                      }
                      
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
                          localStorage.setItem('user', JSON.stringify({
                            name: `${signupFirstName.trim()} ${signupLastName.trim()}`,
                            firstName: signupFirstName.trim(),
                            lastName: signupLastName.trim(),
                            email: signupEmail,
                            provider: 'email',
                            picture: response.data.picture || null,
                            plan: 'Free Plan'
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
                    navigate('/login');
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

export default LandingPage;

