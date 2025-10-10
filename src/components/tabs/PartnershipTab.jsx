import React from 'react';
import './TabStyles.css';

const PartnershipTab = ({ mobile }) => {
  return (
    <div className="tab-content">
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Partnership Activities</h2>
            <p className="section-subtitle">
              Manage and track all partnership activities to strengthen B2B relationships
            </p>
          </div>
        </div>

        {/* Activity Filters */}
        <div style={{
          marginBottom: '32px',
          padding: '24px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="subsection-title" style={{ marginBottom: 0 }}>Activity Filters</h3>
            <button className="btn-primary">+ New Activity</button>
          </div>
          <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: '16px' }}>
            <select style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '14px'
            }}>
              <option>All Partners</option>
              <option>TechCorp Solutions</option>
              <option>Global Ventures</option>
            </select>
            <select style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '14px'
            }}>
              <option>Activity Type</option>
              <option>Meeting</option>
              <option>Call</option>
              <option>Event</option>
            </select>
            <select style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              fontSize: '14px'
            }}>
              <option>All Status</option>
              <option>Completed</option>
              <option>Scheduled</option>
              <option>In Progress</option>
            </select>
          </div>
        </div>

        {/* Activity Summary Cards */}
        <div style={{ marginBottom: '32px' }}>
          <h3 className="subsection-title">Activity Summary</h3>
          <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: '20px', flexWrap: 'wrap' }}>
            {[
              {
                title: 'Quarterly Review',
                company: 'TechCorp Solutions',
                status: 'Completed',
                description: 'Reviewed Q4 performance metrics and discussed expansion opportunities for 2025.',
                date: 'Jan 10, 2025',
                duration: '2h duration',
                icon: '📄',
                color: '#1890ff'
              },
              {
                title: 'Strategy Call',
                company: 'Global Ventures',
                status: 'Scheduled',
                description: 'Discuss joint marketing initiatives and co-branding opportunities.',
                date: 'Jan 18, 2025',
                duration: '1h duration',
                icon: '📋',
                color: '#52c41a'
              },
              {
                title: 'Trade Show',
                company: 'Innovation Labs',
                status: 'In Progress',
                description: 'Joint booth presentation at Tech Summit 2025 conference.',
                date: 'Jan 25-27, 2025',
                duration: '3 days',
                icon: '🖥️',
                color: '#fa8c16'
              }
            ].map((activity, idx) => (
              <div key={idx} style={{
                flex: '1 1 300px',
                padding: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: activity.color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '20px'
                  }}>
                    {activity.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', margin: 0 }}>
                      {activity.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                      {activity.company}
                    </p>
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  marginBottom: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: '#f5f5f5',
                  color: '#666666',
                  display: 'inline-block'
                }}>
                  {activity.status}
                </div>
                <p style={{ fontSize: '12px', color: '#666666', marginBottom: '12px', lineHeight: 1.5 }}>
                  {activity.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666666' }}>
                  <span>{activity.date}</span>
                  <span>{activity.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Table */}
        <div>
          <h3 className="subsection-title">Recent Activities</h3>
          <div className="matrix-table-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>ACTIVITY</th>
                  <th>PARTNER</th>
                  <th>TYPE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    activity: { name: 'Partnership Agreement Review', description: 'Annual contract renewal discussion', icon: '🤝' },
                    partner: 'TechCorp Solutions',
                    type: 'Meeting',
                    date: 'Jan 15, 2025',
                    status: 'Completed'
                  },
                  {
                    activity: { name: 'Follow-up Email', description: 'Post-meeting action items and next steps', icon: '✉️' },
                    partner: 'Global Ventures',
                    type: 'Email',
                    date: 'Jan 12, 2025',
                    status: 'Sent'
                  }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ marginRight: '8px' }}>{row.activity.icon}</span>
                          <span style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: 600 }}>
                            {row.activity.name}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#666666' }}>
                          {row.activity.description}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '8px' }}>👤</span>
                        <span style={{ fontSize: '12px', color: '#1a1a1a' }}>{row.partner}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#1a1a1a' }}>{row.type}</td>
                    <td style={{ fontSize: '12px', color: '#1a1a1a' }}>{row.date}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: '#f5f5f5',
                        color: '#666666',
                        fontSize: '11px'
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          padding: '4px 8px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}>View</button>
                        <button style={{
                          padding: '4px 8px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '4px',
                          background: 'white',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipTab;

