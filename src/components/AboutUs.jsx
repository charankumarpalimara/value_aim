import React, { useState } from "react";
import Header from "./Header";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import "./AboutUs.css";

// High-quality professional images from Unsplash - AI/Data Analytics themed
const aiAnalyticsImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=85"; // Data visualization
const predictiveImage = "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&h=400&fit=crop&q=85"; // AI/Technology workspace
const platformDashboard = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=800&fit=crop&q=85"; // Business analytics screen
const dataInsights = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=700&h=400&fit=crop&q=85"; // Professional team meeting

function AboutUs() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="about-us-page">
      <Header 
        onSignupClick={() => setShowSignupModal(true)} 
        onLoginClick={() => setShowLoginModal(true)}
      />

      <div className="about-content">
        
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="hero-decorator hero-decorator-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="m256 16c-10.7 220.5-19.5 229.3-240 240 220.5 10.7 229.3 19.5 240 240 10.7-220.5 19.5-229.3 240-240-220.5-10.7-229.3-19.5-240-240z"/>
            </svg>
          </div>
          <h1 className="hero-main-title">Redefining B2B Account Intelligence with AI</h1>
          {/* <br/> */}
          <p className="hero-subtitle">Innovate Your Sales Process with Data-Driven Excellence. Let's Shape Your Growth Journey.</p>
          <div className="hero-decorator hero-decorator-right">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="m256 16c-10.7 220.5-19.5 229.3-240 240 220.5 10.7 229.3 19.5 240 240 10.7-220.5 19.5-229.3 240-240-220.5-10.7-229.3-19.5-240-240z"/>
            </svg>
          </div>
        </section>

        {/* Two Column Solutions Section */}
        <section className="about-two-column-section">
          <div className="two-column-container">
            <div className="two-column-header">
              <h2 className="section-heading">Transforming Sales Intelligence for Modern Businesses</h2>
              <p className="section-description">
                In today's complex and competitive B2B landscape, sales success depends on one thing precision. Traditional sales processes rely heavily on intuition and fragmented data, often leading to missed opportunities and inefficiencies. ValueAIM transforms that reality.
              </p>
            </div>
            
            <div className="solutions-two-col-grid">
              <div className="solution-col-item">
                <div className="solution-card-with-icon">
                  <svg className="solution-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <h4 className="solution-card-title">AI-Driven Customer Understanding</h4>
                  <p className="solution-card-text">
                    ValueAIM consolidates public data, market signals, and third-party research to create a 360° view of every potential customer. The platform continuously learns from patterns in buying behavior, company growth trends, and digital footprints identifying who's ready to buy, when, and why. Make data-driven decisions with confidence.
                  </p>
                </div>
              </div>
              
              <div className="solution-col-item">
                <div className="solution-image-wrapper">
                  <div className="solution-image-placeholder">
                    <img src={aiAnalyticsImage} alt="AI Analytics Dashboard" className="solution-image" />
                  </div>
                </div>
              </div>
            </div>

            <div className="solutions-two-col-grid reverse-grid">
              <div className="solution-col-item">
                <div className="solution-image-wrapper">
                  <div className="solution-image-placeholder tall">
                    <img src={predictiveImage} alt="Predictive Intelligence Technology" className="solution-image" />
                  </div>
                </div>
              </div>

              <div className="solution-col-item">
                <div className="solution-card-with-icon">
                  <svg className="solution-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                  <h4 className="solution-card-title">Opportunity Prediction & Targeting</h4>
                  <p className="solution-card-text">
                    Using predictive analytics and proprietary AI models, ValueAIM scores and prioritizes leads based on likelihood to convert, strategic fit, and revenue potential. It enables account teams to focus on the right opportunities, not just more opportunities. Maximize your team's efficiency and ROI with intelligent lead scoring and prioritization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section with Image */}
        <section className="about-process-section">
          <div className="process-container">
            <div className="process-header-row">
              <h2 className="section-heading">How ValueAIM Works</h2>
              <button className="cta-outline-btn" onClick={() => setShowLoginModal(true)}>
                Start Your Journey
              </button>
            </div>

            <div className="process-content-grid">
              <div className="process-image-col">
                <div className="process-main-image">
                  <img src={platformDashboard} alt="AI-Powered Platform Dashboard" className="process-image" />
                </div>
              </div>

              <div className="process-steps-col">
                <div className="process-step-item">
                  <div className="step-number-wrap">
                    <div className="step-num-circle">
                      <h3>1</h3>
                    </div>
                    <div className="step-text-wrap">
                      <h4 className="step-heading">Data Fusion Layer</h4>
                      <p className="step-text">
                        Aggregates public and licensed data from company websites, financial reports, job postings, intent platforms, and market feeds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="process-step-item">
                  <div className="step-number-wrap">
                    <div className="step-num-circle">
                      <h3>2</h3>
                    </div>
                    <div className="step-text-wrap">
                      <h4 className="step-heading">AI Engine</h4>
                      <p className="step-text">
                        Uses machine learning and natural language models to extract insights, classify opportunities, and predict customer needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="process-step-item">
                  <div className="step-number-wrap">
                    <div className="step-num-circle">
                      <h3>3</h3>
                    </div>
                    <div className="step-text-wrap">
                      <h4 className="step-heading">Action Dashboard</h4>
                      <p className="step-text">
                        Provides a unified interface for sales teams — including lead scoring, account alerts, engagement recommendations, and performance tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Masters Section - Powered by Advanced AI Technology */}
        <section className="about-masters-section">
          <div className="masters-container">
            <div className="masters-visual-grid">
              <div className="masters-text-content">
                <h2 className="section-heading">Powered by Advanced AI Technology</h2>
                <p className="masters-description">
                  ValueAIM is an AI-powered B2B sales intelligence platform that empowers account managers, client partners, and business leaders to identify, prioritize, and close high-value opportunities faster. It integrates real-time market intelligence, customer intent data, and AI-driven insights to help teams make smarter, faster, and more confident sales decisions.
                  <br/><br/>
                  Our advanced machine learning algorithms continuously analyze market trends, competitive landscapes, and customer behavior patterns to deliver actionable intelligence. With ValueAIM, sales teams gain a strategic advantage through predictive analytics and data-driven recommendations that transform how they engage with prospects and grow their accounts.
                </p>
              </div>

              <div className="masters-image-col">
                <div className="masters-image-placeholder medium">
                  <img src={dataInsights} alt="Data Insights and Collaboration" className="masters-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What ValueAIM Does Section - 4 Cards */}
        <section className="about-team-section">
          <div className="team-container">
            <h2 className="section-heading">What ValueAIM Does</h2>
            
            <div className="team-grid">
              <div className="team-card">
                <div className="team-card-inner">
                  <div className="team-image">
                    <div className="team-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="team-icon-svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">Intelligent Account Insights</h4>
                    <p className="team-role">The system surfaces deep account intelligence from leadership changes to technology adoption and industry shifts helping sales teams tailor their approach and engage in meaningful, data-backed conversations with clients.</p>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-card-inner">
                  <div className="team-image">
                    <div className="team-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="team-icon-svg">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">Smart Sales Enablement</h4>
                    <p className="team-role">Through integrated AI recommendations, ValueAIM suggests personalized pitches, content, and outreach timing. It acts as a co-pilot for client partners, turning data into actionable engagement strategies.</p>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-card-inner">
                  <div className="team-image">
                    <div className="team-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="team-icon-svg">
                        <path d="M3 3v18h18M7 16l4-4 4 4 6-6"/>
                      </svg>
                    </div>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">Business Impact</h4>
                    <p className="team-role">ValueAIM replaces guesswork with guided precision ensuring every customer interaction delivers measurable value and drives tangible results for your sales organization.</p>
                  </div>
                </div>
              </div>

              <div className="team-card">
                <div className="team-card-inner">
                  <div className="team-image">
                    <div className="team-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="team-icon-svg">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">For Sales Leaders</h4>
                    <p className="team-role">Gain real-time visibility into account health, pipeline efficiency, and forecast accuracy empowering data-driven decisions at every level of your organization.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Impact Metrics Section */}
        <section className="about-metrics-section">
          <div className="metrics-container">
            <h2 className="section-heading">Business Impact</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">30-40%</div>
                <div className="metric-label">Increase in qualified opportunity pipeline</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">50%</div>
                <div className="metric-label">Faster deal conversion cycles</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">25%</div>
                <div className="metric-label">Improvement in client engagement outcomes</div>
              </div>
            </div>
            {/* <p className="metrics-description">
              ValueAIM replaces guesswork with guided precision ensuring every customer interaction delivers measurable value.
            </p> */}
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="about-who-section">
          <div className="who-container">
            <h2 className="section-heading">Who It's For</h2>
            <div className="who-grid">
              <div className="who-card">
                <div className="who-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                  </svg>
                </div>
                <h3 className="who-title">Client Partners & Account Managers</h3>
                <p className="who-description">
                  Identify cross-sell and upsell opportunities across existing accounts by understanding the real buying intent signals
                </p>
              </div>
              <div className="who-card">
                <div className="who-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                  </svg>
                </div>
                <h3 className="who-title">CXOs & Sales Leaders</h3>
                <p className="who-description">
                  Gain real-time visibility into account health, pipeline efficiency, and forecast accuracy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Where Data Meets Account Growth - Final CTA Section */}
        <section className="about-final-cta-section">
          <div className="final-cta-decorator final-cta-decorator-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="m256 16c-10.7 220.5-19.5 229.3-240 240 220.5 10.7 229.3 19.5 240 240 10.7-220.5 19.5-229.3 240-240-220.5-10.7-229.3-19.5-240-240z"/>
            </svg>
          </div>
          <div className="final-cta-container">
            <h2 className="hero-main-title">Where Data Meets Account Growth</h2>
            <p className="hero-subtitle">
              With ValueAIM, enterprises move beyond traditional sales methods transforming insights into action and relationships into revenue.
            </p>
            <button className="final-cta-button" onClick={() => setShowLoginModal(true)}>
              Get Started
            </button>
          </div>
          <div className="final-cta-decorator final-cta-decorator-right">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="m256 16c-10.7 220.5-19.5 229.3-240 240 220.5 10.7 229.3 19.5 240 240 10.7-220.5 19.5-229.3 240-240-220.5-10.7-229.3-19.5-240-240z"/>
            </svg>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="about-cta-section">
          <div className="cta-container">
            <div className="cta-content-wrapper">
              <div className="cta-text-content">
                <h2 className="cta-heading">Ready to Transform Your Sales Process?</h2>
                <p className="cta-description">
                  Partner with ValueAIM and take the first step towards transforming your digital sales intelligence. With ValueAIM, enterprises move beyond traditional sales methods – transforming insights into action and relationships into revenue.
                </p>
              </div>
              <div className="cta-button-wrap">
                <button className="cta-primary-btn" onClick={() => navigate('/')}>
                  <span>Start Your Journey</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14">
                    <path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="cta-visual-section">
              <div className="cta-social-links">
                <div className="cta-logo-text">
                  <h3>ValueAIM</h3>
                </div>
                <div className="social-icons-group">
                  <a href="#" className="social-icon-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="20">
                      <path fill="currentColor" d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-icon-link">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Footer Section */}
        {/* <footer className="about-footer-section">
          <div className="footer-container">
            <div className="footer-widgets">
              <div className="footer-widget footer-services">
                <h4 className="footer-widget-title">Services</h4>
                <ul className="footer-menu">
                  <li><a href="#">AI-Driven Insights</a></li>
                  <li><a href="#">Opportunity Prediction</a></li>
                  <li><a href="#">Account Intelligence</a></li>
                  <li><a href="#">Sales Enablement</a></li>
                </ul>
              </div>

              <div className="footer-widget footer-company">
                <h4 className="footer-widget-title">Company</h4>
                <ul className="footer-menu">
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="/contact-us">Contact</a></li>
                </ul>
              </div>

              <div className="footer-widget footer-contact">
                <h4 className="footer-widget-title">Contact</h4>
                <p className="footer-address">Empowering B2B Sales Teams Worldwide</p>
                <ul className="footer-contact-list">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14">
                      <path fill="currentColor" d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
                    </svg>
                    <span>+1 (888) 123-4567</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14">
                      <path fill="currentColor" d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/>
                    </svg>
                    <span>info@valueaim.com</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-copyright">
                <p>Copyright © 2025 ValueAIM</p>
              </div>
            </div>
          </div>
        </footer> */}

      </div>

      {/* Modals */}
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onLoginClick={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

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

export default AboutUs;
