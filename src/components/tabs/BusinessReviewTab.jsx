import React from 'react';
import './TabStyles.css';

const BusinessReviewTab = ({ mobile, tablet }) => {
  return (
    <div className="tab-content">
      <div className="tab-section">
        {/* Outstanding Achievement Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)',
          borderRadius: '12px',
          padding: mobile ? '24px' : '32px',
          marginBottom: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: mobile ? '20px' : '28px', fontWeight: 700, marginBottom: '12px' }}>
              Outstanding Quarter Achievement! 🎉
            </h2>
            <p style={{ fontSize: mobile ? '13px' : '14px', opacity: 0.9, marginBottom: '24px' }}>
              Congratulations on exceeding all targets and milestones
            </p>
            
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '16px' : '32px' }}>
              <div style={{ textAlign: mobile ? 'center' : 'left' }}>
                <div style={{ fontSize: mobile ? '28px' : '36px', fontWeight: 700 }}>127%</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Revenue Growth</div>
              </div>
              <div style={{ textAlign: mobile ? 'center' : 'left' }}>
                <div style={{ fontSize: mobile ? '28px' : '36px', fontWeight: 700 }}>94%</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Customer Satisfaction</div>
              </div>
              <div style={{ textAlign: mobile ? 'center' : 'left' }}>
                <div style={{ fontSize: mobile ? '28px' : '36px', fontWeight: 700 }}>15</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>New Partnerships</div>
              </div>
            </div>
          </div>
          
          <div style={{
            position: 'absolute',
            right: mobile ? '16px' : '32px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.3,
            fontSize: mobile ? '60px' : '80px'
          }}>
            🏆
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`}>
          {/* Performance Overview */}
          <div className="analysis-card" style={{ flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ marginBottom: 0 }}>Performance Overview</h3>
              <span style={{ fontSize: '12px', color: '#666666' }}>Q4 2024</span>
            </div>
            
            {/* Trend Chart Placeholder */}
            <div style={{
              height: '250px',
              background: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: '1px solid #f0f0f0',
              marginBottom: '20px'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ padding: '20px' }}>
                <polyline
                  points="20,160 70,130 120,90 170,70 220,50"
                  fill="none"
                  stroke="#201F47"
                  strokeWidth="3"
                />
                {[20, 70, 120, 170, 220].map((x, i) => (
                  <circle key={i} cx={x} cy={[160, 130, 90, 70, 50][i]} r="5" fill="#201F47" />
                ))}
              </svg>
            </div>

            {/* Revenue and Customers Cards */}
            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: '16px' }}>
              <div style={{
                flex: 1,
                padding: '16px',
                background: '#f8fffe',
                borderRadius: '8px',
                border: '1px solid #e6fffa'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#10b981',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    ↑
                  </div>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Revenue</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>$2.4M</div>
              </div>

              <div style={{
                flex: 1,
                padding: '16px',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    👤
                  </div>
                  <span style={{ fontSize: '12px', color: '#666666' }}>New Customers</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>847</div>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="analysis-card" style={{ flex: 1 }}>
            <h3 className="subsection-title">Key Achievements</h3>
            
            {[
              {
                title: 'Product Launch Success',
                description: 'New AI features adopted by 78% of customers',
                color: '#10b981'
              },
              {
                title: 'Customer Excellence',
                description: 'Highest NPS score of 72 this year',
                color: '#3b82f6'
              },
              {
                title: 'Strategic Partnerships',
                description: 'Secured 5 enterprise partnerships',
                color: '#8b5cf6'
              },
              {
                title: 'Market Expansion',
                description: 'Entered 3 new international markets',
                color: '#f59e0b'
              }
            ].map((achievement, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: achievement.color,
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px'
                }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                    {achievement.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666666' }}>
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`}>
          {/* Customer Satisfaction */}
          <div className="analysis-card" style={{ textAlign: 'center' }}>
            <h3 className="subsection-title" style={{ textAlign: 'left' }}>Customer Satisfaction</h3>
            
            {/* Semi-circle Progress */}
            <div style={{
              width: '160px',
              height: '80px',
              margin: '0 auto 32px',
              position: 'relative'
            }}>
              <div style={{
                width: '160px',
                height: '80px',
                borderRadius: '80px 80px 0 0',
                background: 'conic-gradient(from 180deg, #10b981 0deg 169deg, #e5e7eb 169deg 180deg)',
                position: 'relative'
              }}>
                <div style={{
                  width: '120px',
                  height: '60px',
                  borderRadius: '60px 60px 0 0',
                  backgroundColor: 'white',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '10px'
                }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>94%</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>94%</div>
                <div style={{ fontSize: '11px', color: '#666666' }}>Overall Score</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3b82f6' }}>89%</div>
                <div style={{ fontSize: '11px', color: '#666666' }}>Retention Rate</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#8b5cf6' }}>72</div>
                <div style={{ fontSize: '11px', color: '#666666' }}>NPS Score</div>
              </div>
            </div>
          </div>

          {/* Team Recognition */}
          <div className="analysis-card">
            <h3 className="subsection-title">Team Recognition</h3>
            
            {[
              { name: 'Sarah Johnson', role: 'Top Sales Performer - 150% of target', icon: 'SJ', color: '#fbbf24', emoji: '🥇', bg: '#fefce8' },
              { name: 'Mike Chen', role: 'Customer Success Champion', icon: 'MC', color: '#10b981', emoji: '🏆', bg: '#effdf4' },
              { name: 'Emily Rodriguez', role: 'Innovation Leader', icon: 'ER', color: '#3b82f6', emoji: '💡', bg: '#dce2eb' }
            ].map((member, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: member.bg,
                padding: '12px',
                borderRadius: '6px',
                border: `1px solid ${member.color}40`,
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: member.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {member.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{member.name}</div>
                  <div style={{ fontSize: '11px', color: '#666666' }}>{member.role}</div>
                </div>
                <div style={{ fontSize: '24px' }}>{member.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q1 2025 Goals */}
        <div style={{ marginTop: '32px' }}>
          <div className="analysis-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ marginBottom: 0 }}>Q1 2025 Goals & Initiatives</h3>
              <span style={{
                fontSize: '11px',
                color: '#3b82f6',
                backgroundColor: '#eff6ff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontWeight: 500
              }}>
                Strategic Focus
              </span>
            </div>

            <div className={`opportunity-cards ${mobile || tablet ? 'mobile' : ''}`}>
              {[
                { title: 'Revenue Growth', goal: 'Target 35% increase in MRR through upselling and new acquisitions', progress: '0%', color: '#10b981', bg: '#f0fdf4' },
                { title: 'Customer Expansion', goal: 'Onboard 500+ new enterprise customers across target verticals', progress: '0%', color: '#3b82f6', bg: '#eff6ff' },
                { title: 'Product Innovation', goal: 'Launch 3 major features based on customer feedback', progress: '0%', color: '#8b5cf6', bg: '#faf5ff' }
              ].map((goal, idx) => (
                <div key={idx} style={{
                  padding: '20px',
                  background: goal.bg,
                  borderRadius: '8px',
                  border: `1px solid ${goal.color}40`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: goal.color,
                      borderRadius: '4px'
                    }}></div>
                    <h4 style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                      {goal.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: '11px', color: '#666666', marginBottom: '12px' }}>
                    {goal.goal}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#666666' }}>Progress</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: goal.color }}>{goal.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: mobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{ fontSize: '11px', color: '#666666' }}>Generated on December 15, 2024</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary">Export Report</button>
            <button className="btn-secondary">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessReviewTab;

