import React from 'react';
import './TabStyles.css';

const BusinessValueTab = ({ mobile, tablet }) => {
  return (
    <div className="tab-content">
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Value Generated Analytics</h2>
            <p className="section-subtitle">Track and measure the value delivered to your B2B customers</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '12px'
            }}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
            <button className="btn-primary">Export</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={`stats-grid ${mobile || tablet ? 'mobile' : ''}`}>
          <div className="stat-card" style={{ background: '#dcfce6', borderColor: '#bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#10b981',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                $
              </div>
              <div style={{
                background: '#dcfce6',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#3bb468',
                fontWeight: 600
              }}>
                +19.2%
              </div>
            </div>
            <div className="stat-value">$2.4M</div>
            <div className="stat-label">Total Value Generated</div>
          </div>

          <div className="stat-card" style={{ background: '#dbeafe', borderColor: '#bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                👤
              </div>
              <div style={{
                background: '#dbeafe',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#3670ed',
                fontWeight: 600
              }}>
                +8.3%
              </div>
            </div>
            <div className="stat-value">$185K</div>
            <div className="stat-label">Avg Value per Customer</div>
          </div>

          <div className="stat-card" style={{ background: '#f3e8ff', borderColor: '#e9d5ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#9334e9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                📊
              </div>
              <div style={{
                background: '#f3e8ff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#9334e9',
                fontWeight: 600
              }}>
                -2.1%
              </div>
            </div>
            <div className="stat-value">4.2x</div>
            <div className="stat-label">Average ROI</div>
          </div>

          <div className="stat-card" style={{ background: '#ffedd5', borderColor: '#fed7aa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ea580b',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                ✓
              </div>
              <div style={{
                background: '#ffedd5',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#ea580b',
                fontWeight: 600
              }}>
                +5.2%
              </div>
            </div>
            <div className="stat-value">8.7</div>
            <div className="stat-label">Value Satisfaction Score</div>
          </div>
        </div>

        {/* Value Generation Trend & Top Customers */}
        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`} style={{ marginBottom: '32px' }}>
          {/* Trend Chart */}
          <div className="analysis-card" style={{ flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ marginBottom: 0 }}>Value Generation Trend</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Monthly</button>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Quarterly</button>
              </div>
            </div>
            <div style={{
              height: '300px',
              background: '#f9fafb',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: '1px solid #f0f0f0'
            }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ padding: '20px' }}>
                <polyline
                  points="20,150 70,120 120,130 170,100 220,110 270,80 320,90"
                  fill="none"
                  stroke="#201F47"
                  strokeWidth="2"
                />
                {[20, 70, 120, 170, 220, 270, 320].map((x, i) => (
                  <circle key={i} cx={x} cy={[150, 120, 130, 100, 110, 80, 90][i]} r="4" fill="#201F47" />
                ))}
              </svg>
            </div>
          </div>

          {/* Top Customers */}
          <div className="analysis-card" style={{ flex: 1 }}>
            <h3 className="subsection-title">Top Value Customers</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Acme Corp', segment: 'Enterprise', value: '$450K', change: '+18%', color: '#1890ff', initial: 'A' },
                { name: 'Tech Innovations', segment: 'Mid Market', value: '$320K', change: '+12%', color: '#52c41a', initial: 'T' },
                { name: 'Global Systems', segment: 'Enterprise', value: '$285K', change: '-5%', color: '#722ed1', initial: 'G' }
              ].map((customer, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  borderRadius: '8px',
                  background: '#fafafa'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: customer.color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '12px'
                  }}>
                    {customer.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{customer.name}</div>
                    <div style={{ fontSize: '11px', color: '#666666' }}>{customer.segment}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{customer.value}</div>
                    <div style={{
                      fontSize: '10px',
                      color: customer.change.startsWith('+') ? '#52c41a' : '#fa8c16'
                    }}>
                      {customer.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Breakdown by Category */}
        <div style={{ marginBottom: '32px' }}>
          <h3 className="subsection-title">Value Breakdown by Category</h3>
          <div className={`stats-grid ${mobile || tablet ? 'mobile' : ''}`} style={{ gridTemplateColumns: mobile || tablet ? '1fr' : 'repeat(3, 1fr)' }}>
            {[
              { category: 'Time Savings', value: '$980K', percentage: 41, color: '#52c41a', icon: '$' },
              { category: 'Cost Reduction', value: '$720K', percentage: 30, color: '#1890ff', icon: '↓' },
              { category: 'Revenue Growth', value: '$700K', percentage: 29, color: '#722ed1', icon: '📊' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '24px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 auto 16px'
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '12px', color: '#666666', marginBottom: '16px' }}>
                  {item.category}
                </div>
                <div className="progress-bar" style={{ marginBottom: '8px' }}>
                  <div className="progress-fill" style={{ width: `${item.percentage}%`, backgroundColor: item.color }}></div>
                </div>
                <div style={{ fontSize: '11px', color: item.color, fontWeight: 600 }}>
                  {item.percentage}% of total value
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Value Activities */}
        <div>
          <h3 className="subsection-title">Recent Value Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                title: 'Process Optimization Completed',
                description: 'Acme Corp Saved $45k in Operational costs Through Automated Workflow',
                value: '$45K',
                time: '2 hours ago',
                icon: 'P',
                color: '#1890ff'
              },
              {
                title: 'Revenue Milestone Achieved',
                description: 'Mid Market Achieved $1M in Revenue',
                value: '$1M',
                time: '1 day ago',
                icon: 'R',
                color: '#52c41a'
              }
            ].map((activity, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: activity.color,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  marginRight: '12px'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>{activity.title}</div>
                  <div style={{ fontSize: '11px', color: '#666666' }}>{activity.description}</div>
                  <div style={{ fontSize: '11px', color: '#666666' }}>{activity.time}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1a1a' }}>
                  {activity.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessValueTab;

