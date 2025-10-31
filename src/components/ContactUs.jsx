import React, { useState } from "react";
import Header from "./Header";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { contactAPI } from "../utils/api";
import "./ContactUs.css";

function ContactUs() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });
  
  // Helper function to split name into firstName and lastName
  const splitName = (fullName) => {
    const trimmedName = fullName.trim();
    if (!trimmedName) return { firstName: "", lastName: "" };
    
    const nameParts = trimmedName.split(/\s+/);
    if (nameParts.length === 1) {
      // If only one word, use it as firstName and lastName
      return { firstName: nameParts[0], lastName: nameParts[0] };
    }
    
    // First word is firstName, rest is lastName
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
  };
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: null, text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear submit message when user starts typing
    if (submitMessage.type) {
      setSubmitMessage({ type: null, text: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ type: null, text: "" }); // Clear any previous messages
    
    try {
      // Split name into firstName and lastName
      const { firstName, lastName } = splitName(formData.name);
      
      // Prepare contact data according to backend API
      const contactData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };
      
      // Call the backend API
      const response = await contactAPI.create(contactData);
      
      if (response.success) {
        // Show success message
        setSubmitMessage({
          type: "success",
          text: response.message || "Thank you for your message! We'll get back to you soon."
        });
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: ""
        });
        
        // Clear any errors
        setErrors({});
      } else {
        // Handle API error response
        setSubmitMessage({
          type: "error",
          text: response.message || "There was an error sending your message. Please try again."
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      
      // Handle different error types
      let errorMessage = "There was an error sending your message. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitMessage({
        type: "error",
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-page">
      <Header 
        onSignupClick={() => setShowSignupModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
      />
      
      <div className="contact-us-content">
        <div className="contact-container">
          {/* Left Section - Contact Information */}
          <div className="contact-info-section">
            <div className="section-subtitle">Come Visit Us At</div>
            <div className="section-title">
              Our Address
              <div className="title-underline"></div>
            </div>
            
            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1C6.13 1 3 4.13 3 8C3 12.17 10 19 10 19C10 19 17 12.17 17 8C17 4.13 13.87 1 10 1ZM10 10.5C8.62 10.5 7.5 9.38 7.5 8C7.5 6.62 8.62 5.5 10 5.5C11.38 5.5 12.5 6.62 12.5 8C12.5 9.38 11.38 10.5 10 10.5Z" fill="white"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Office Address</div>
                  <div className="contact-value">4929 Switchback Street, Aubrey, Texas 76227 USA</div>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M18.33 13.83L15.33 10.83C15.07 10.57 14.67 10.57 14.42 10.83L11.75 13.5C11.33 13.33 10.83 13.08 10.33 12.75C9.83 12.42 9.33 11.92 9 11.42C8.67 10.92 8.42 10.42 8.25 10L10.92 7.33C11.17 7.08 11.17 6.67 10.92 6.42L7.92 3.42C7.67 3.17 7.25 3.17 7 3.42L3.08 7.33C2.83 7.58 2.67 7.92 2.67 8.33C2.67 9.92 3.25 11.42 4.33 12.5C5.42 13.58 6.92 14.17 8.5 14.17C8.92 14.17 9.25 14 9.5 13.75L13.42 9.83C13.67 9.58 14.08 9.58 14.33 9.83L17.33 12.83C17.58 13.08 17.58 13.5 17.33 13.75L18.33 13.83Z" fill="white"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Call Us</div>
                  <div className="contact-value">+1 9869106050</div>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M17 3H3C1.9 3 1.01 3.9 1.01 5L1 15C1 16.1 1.9 17 3 17H17C18.1 17 19 16.1 19 15V5C19 3.9 18.1 3 17 3ZM17 7L10 11.5L3 7V5L10 9.5L17 5V7Z" fill="white"/>
                  </svg>
                </div>
                <div className="contact-details">
                  <div className="contact-label">Our Email</div>
                  <div className="contact-value">Info@Alantur.ai</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Contact Form */}
          <div className="contact-form-section">
            <div className="section-subtitle">Send Message</div>
            <div className="section-title">
              Drop Us A Line
              <div className="title-underline"></div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name*"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 14px',
                      border: errors.name ? '2px solid #ff4d4f' : '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      color: '#201F47',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      width: '100%',
                      height: 'auto',
                      minHeight: '40px',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      if (!errors.name) {
                        e.target.style.borderColor = '#201F47';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.name) {
                        e.target.style.borderColor = '#ddd';
                      }
                    }}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone*"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 14px',
                      border: errors.phone ? '2px solid #ff4d4f' : '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      color: '#201F47',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      width: '100%',
                      height: 'auto',
                      minHeight: '40px',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      if (!errors.phone) {
                        e.target.style.borderColor = '#201F47';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.phone) {
                        e.target.style.borderColor = '#ddd';
                      }
                    }}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email*"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 14px',
                      border: errors.email ? '2px solid #ff4d4f' : '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      color: '#201F47',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      width: '100%',
                      height: 'auto',
                      minHeight: '40px',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#201F47';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#ddd';
                      }
                    }}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject*"
                    value={formData.subject}
                    onChange={handleInputChange}
                    style={{
                      padding: '10px 14px',
                      border: errors.subject ? '2px solid #ff4d4f' : '2px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '13px',
                      backgroundColor: 'white',
                      color: '#201F47',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                      width: '100%',
                      height: 'auto',
                      minHeight: '40px',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => {
                      if (!errors.subject) {
                        e.target.style.borderColor = '#201F47';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.subject) {
                        e.target.style.borderColor = '#ddd';
                      }
                    }}
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
              </div>
              
              <div className="form-group form-group-full">
                <textarea
                  name="message"
                  placeholder="Message*"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  style={{
                    padding: '10px 14px',
                    border: errors.message ? '2px solid #ff4d4f' : '2px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: 'white',
                    color: '#201F47',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                    width: '100%',
                    resize: 'vertical',
                    minHeight: '100px',
                    lineHeight: '1.5',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = '#201F47';
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.message) {
                      e.target.style.borderColor = '#ddd';
                    }
                  }}
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              
              {submitMessage.type && (
                <div className={`submit-message ${submitMessage.type === "success" ? "success-message" : "error-message"}`}>
                  {submitMessage.text}
                </div>
              )}
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLoginClick={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSignupClick={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
    </div>
  );
}

export default ContactUs;

