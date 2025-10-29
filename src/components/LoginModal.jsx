import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from '../utils/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onSignupClick }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [showOtpOption, setShowOtpOption] = useState(false);
  const [showTryAnotherWay, setShowTryAnotherWay] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingOtpEmail, setIsCheckingOtpEmail] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP errors
  const [otpError, setOtpError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState('');

  // OTP timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset all state
      setEmail("");
      setPassword('');
      setShowOtpOption(false);
      setShowTryAnotherWay(false);
      setOtpEmail('');
      setOtp('');
      setPasswordError(false);
      setPasswordErrorMessage('');
      setOtpError(false);
      setOtpErrorMessage('');
      setShowPassword(false);
    }
  }, [isOpen]);

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
        onClose();
        
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
        onClose();

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

  if (!isOpen) return null;

  return (
    <div className="signup-modal-overlay" onClick={onClose}>
      <div className="signup-modal" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button 
          className="signup-close-btn" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10
          }}
        >
          ×
        </button>
        <div className="signup-modal-header">
          <h3 style={{ textAlign: 'center', width: '100%', marginBottom: '0' }}>Log in</h3>
          <br/>
          <p style={{ textAlign: 'center', marginBottom: '24px', marginTop: '-8px', paddingTop: '0', color: '#666', fontSize: '13px', lineHeight: '1.4' }}>
            Next Generation AI platform for B2B Sales.
          </p>
        </div>
        
        <div className="signup-form">


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
                    style={{ fontSize: '13px' }}
                    type="button"
                  >
                    Try another way
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Try Another Way Section */}
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
                          style={{ fontSize: '13px', width: '100%' }}
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
                          style={{ fontSize: '13px' }}
                          type="button"
                        >
                          Back to email
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="signup-login-link" style={{ marginTop: '12px' }}>
            Don't have an account? 
            <button 
              type="button" 
              className="signup-login-btn"
              onClick={() => {
                onClose();
                if (onSignupClick) {
                  onSignupClick();
                }
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

