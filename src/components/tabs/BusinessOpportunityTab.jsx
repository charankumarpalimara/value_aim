import React from 'react';
import './TabStyles.css';

const BusinessOpportunityTab = ({ mobile, tablet }) => {
  return (
    <div className="tab-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Customer Revenue by Business Unit */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Customer Revenue by Business Unit</h2>
            <p className="section-subtitle">
              Share of revenue, presence strength and weakness, and RM actions to expand footprint
            </p>
          </div>
          <button className="btn-primary">Plan Actions</button>
        </div>

        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`}>
          {/* Donut Chart Section */}
          <div className="donut-chart-container">
            <div className="donut-chart" style={{
              background: 'conic-gradient(from 0deg, #10b981 0deg 108deg, #3b82f6 108deg 180deg, #ef4444 180deg 252deg, #f59e0b 252deg 324deg, #1f2937 324deg 360deg)'
            }}>
              <div className="donut-center">
                <div className="donut-value">$1.8M</div>
                <div className="donut-label">Total Revenue</div>
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item-chart">
                <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                <span>Payments</span>
              </div>
              <div className="legend-item-chart">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Lending</span>
              </div>
              <div className="legend-item-chart">
                <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                <span>Wealth</span>
              </div>
              <div className="legend-item-chart">
                <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Operations</span>
              </div>
              <div className="legend-item-chart">
                <div className="legend-color" style={{ backgroundColor: '#1f2937' }}></div>
                <span>IT Services</span>
              </div>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-label">Total Revenue</div>
                <div className="info-value">$1.8M</div>
              </div>
              <div className="info-card">
                <div className="info-label">Units Tracked</div>
                <div className="info-value">5</div>
              </div>
            </div>
          </div>

          {/* Presence and Actions */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="subsection-title" style={{ marginBottom: 0 }}>Strong Presence</h3>
                <div style={{
                  background: '#14a249',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8L8 12L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Payments - 85%</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="subsection-title" style={{ marginBottom: 0 }}>Weak Presence</h3>
                <div style={{
                  background: '#db7707',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Items */}
            {['IT Shared Services', 'Wealth', 'Operations'].map((unit) => (
              <div key={unit} style={{
                marginBottom: '12px',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                  {unit}
                </h4>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  • Discovery call (business + technical)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Growth Opportunities</h2>
            <p className="section-subtitle">Identify opportunities to expand business with existing accounts</p>
          </div>
        </div>

        <div className={`opportunity-cards ${mobile || tablet ? 'mobile' : ''}`}>
          {[
            {
              title: 'Service Expansion - Acme Corp',
              value: '$300K',
              probability: '85%',
              closeDate: '10/04/2024',
              status: 'proposal',
              progress: 85
            },
            {
              title: 'New Platform License - Global Solutions Ltd',
              value: '$190K',
              probability: '60%',
              closeDate: '16/05/2024',
              status: 'proposal',
              progress: 60
            },
            {
              title: 'Enterprise Upgrade - DataFlow Systems',
              value: '$220K',
              probability: '70%',
              closeDate: '10/04/2024',
              status: 'qualify',
              progress: 70
            }
          ].map((opp, idx) => (
            <div key={idx} className="opportunity-card">
              <div className="opportunity-header">
                <h3 className="opportunity-title">{opp.title}</h3>
              </div>
              <div className="opportunity-meta">
                <div className="meta-row">
                  <span className="meta-label">Value:</span>
                  <span className="meta-value">{opp.value}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Probability:</span>
                  <span className="meta-value">{opp.probability}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Expected Close:</span>
                  <span className="meta-value">{opp.closeDate}</span>
                </div>
              </div>
              <div className="opportunity-progress">
                <div className="opportunity-progress-fill" style={{ width: `${opp.progress}%` }}></div>
              </div>
              <button className="opportunity-status">{opp.status}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Activities */}
      <div className="tab-section">
        <h2 className="section-title">Strategic Activities for Relationship Manager</h2>
        <div className={`opportunity-cards ${mobile || tablet ? 'mobile' : ''}`}>
          {['IT Shared Services', 'Wealth', 'Operations'].map((unit) => (
            <div key={unit} style={{
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>
                {unit}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                    Discovery call (business + technical)
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Discover business pain, success metrics, timeline, and technical context to qualify the opportunity.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                    Business case & ROI/TCO analysis
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Quantify value with metrics, cost comparison, and payback period.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
                    POC/pilot plan with success criteria
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Define scope, timeline, success metrics, and resources for a time-based pilot.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessOpportunityTab;

