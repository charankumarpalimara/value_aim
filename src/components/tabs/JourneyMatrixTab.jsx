import React from 'react';
import './TabStyles.css';

const JourneyMatrixTab = ({ mobile, tablet }) => {
  return (
    <div className="tab-content">
      {/* ServiceMap Header */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">ServiceMap: Journey Matrix</h2>
            <p className="section-subtitle">Map services across customer journey touchpoints</p>
          </div>
          <div className="section-actions">
            <button className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Export
            </button>
            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Edit Matrix
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={`stats-grid ${mobile || tablet ? 'mobile' : ''}`}>
          <div className="stat-card blue">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">12</div>
              <div className="stat-label">Total Services</div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">6</div>
              <div className="stat-label">Journey Stages</div>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">24</div>
              <div className="stat-label">Touchpoints</div>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">85%</div>
              <div className="stat-label">Coverage</div>
            </div>
          </div>
        </div>

        {/* Service-Journey Mapping Matrix */}
        <div className="matrix-section">
          <h3 className="subsection-title">Service-Journey Mapping Matrix</h3>
          <div className="matrix-table-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Services</th>
                  <th>Awareness</th>
                  <th>Consideration</th>
                  <th>Purchase</th>
                  <th>Onboarding</th>
                  <th>Usage</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { service: 'Marketing Campaigns', stages: ['green', 'green', 'grey', 'grey', 'grey', 'orange'] },
                  { service: 'Sales Support', stages: ['orange', 'green', 'orange', 'grey', 'grey', 'grey'] },
                  { service: 'Customer Onboarding', stages: ['grey', 'grey', 'orange', 'green', 'green', 'green'] },
                  { service: 'Technical Support', stages: ['grey', 'grey', 'orange', 'green', 'green', 'green'] },
                  { service: 'Training Services', stages: ['grey', 'orange', 'grey', 'green', 'green', 'orange'] },
                  { service: 'Account Management', stages: ['grey', 'grey', 'orange', 'green', 'green', 'green'] }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="service-name">{row.service}</td>
                    {row.stages.map((stage, i) => (
                      <td key={i} className="impact-cell">
                        <span className={`impact-dot ${stage}`}></span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className={`legend ${mobile ? 'mobile' : ''}`}>
            <div className="legend-item">
              <span className="impact-dot green"></span>
              <span>High Impact</span>
            </div>
            <div className="legend-item">
              <span className="impact-dot orange"></span>
              <span>Medium Impact</span>
            </div>
            <div className="legend-item">
              <span className="impact-dot grey"></span>
              <span>Low/No Impact</span>
            </div>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`}>
          <div className="analysis-card">
            <h3 className="subsection-title">Journey Stage Analysis</h3>
            {[
              { stage: 'Awareness', percentage: 75, color: '#1890ff' },
              { stage: 'Consideration', percentage: 83, color: '#52c41a' },
              { stage: 'Purchase', percentage: 67, color: '#722ed1' }
            ].map((item) => (
              <div key={item.stage} className="progress-item">
                <div className="progress-header">
                  <span>{item.stage}</span>
                  <span className="progress-value">{item.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="analysis-card">
            <h3 className="subsection-title">Service Coverage</h3>
            {[
              { service: 'Technical Support', coverage: 100, color: '#52c41a' },
              { service: 'Account Management', coverage: 83, color: '#52c41a' },
              { service: 'Training Services', coverage: 67, color: '#fa8c16' },
              { service: 'Marketing Campaigns', coverage: 50, color: '#fa8c16' }
            ].map((item) => (
              <div key={item.service} className="coverage-item">
                <span className="coverage-label">{item.service}</span>
                <span className="coverage-badge" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                  {item.coverage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h3 className="subsection-title">Recommendations</h3>
          <div className={`recommendation-grid ${mobile ? 'mobile' : ''}`}>
            <div className="recommendation-card error">
              <h4>Gap Analysis</h4>
              <p>Purchase stage needs more service support coverage</p>
            </div>
            <div className="recommendation-card success">
              <h4>Optimization</h4>
              <p>Enhance onboarding touchpoints for consideration phases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyMatrixTab;

