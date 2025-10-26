import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OTPScreen.css';

const OTPScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const email = localStorage.getItem('otpEmail') || 'user@example.com';

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      alert('Please enter the complete OTP');
      return;
    }

    setIsVerifying(true);

    try {
      console.log('Verifying OTP:', otpValue);
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('OTP verified successfully!');
      navigate('/company-details');
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log('Resending OTP to:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('OTP resent successfully!');
      setTimer(300);
      setIsResendDisabled(true);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  const handleChangeEmail = () => {
    localStorage.removeItem('otpEmail');
    navigate('/login');
  };

  return (
    <div className="otp-screen">
      <div className="otp-container">
        <div className="otp-header">
          <h1 className="otp-title">Verify your email</h1>
          <p className="otp-subtitle">
            We've sent a 6-digit code to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="otp-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="otp-timer">
          {timer > 0 ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2C4.6875 2 2 4.6875 2 8C2 11.3125 4.6875 14 8 14C11.3125 14 14 11.3125 14 8C14 4.6875 11.3125 2 8 2ZM8 13C5.23438 13 3 10.7656 3 8C3 5.23438 5.23438 3 8 3C10.7656 3 13 5.23438 13 8C13 10.7656 10.7656 13 8 13Z"
                  fill="#666"
                />
                <path
                  d="M8.5 4.5V8.5L11 10.5"
                  stroke="#666"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Code expires in {formatTime(timer)}</span>
            </>
          ) : (
            <span className="otp-expired">Code expired</span>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 || isVerifying}
          className="otp-verify-btn"
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>

        <div className="otp-actions">
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className="otp-resend-btn"
          >
            Resend code
          </button>
          <button onClick={handleChangeEmail} className="otp-change-email-btn">
            Change email
          </button>
        </div>

        <div className="otp-help">
          <p>Didn't receive the code?</p>
          <p>Check your spam folder or contact support</p>
        </div>
      </div>
    </div>
  );
};

export default OTPScreen;
