import React from 'react';
import './TabStyles.css';

const JourneyMatrixTab = ({ mobile, tablet }) => {
  const journeyStages = [
    { stage: 'Awareness', stakeholders: 'Executive Sponsor, Business Unit Leads', activities: 'Initial contact, Value proposition presentation', status: 'completed' },
    { stage: 'Consideration', stakeholders: 'Technical Team, Procurement', activities: 'Product demo, Technical assessment', status: 'in-progress' },
    { stage: 'Decision', stakeholders: 'C-Suite, Finance', activities: 'Business case review, Contract negotiation', status: 'pending' },
    { stage: 'Implementation', stakeholders: 'IT Team, Project Manager', activities: 'Deployment planning, Training', status: 'pending' },
    { stage: 'Expansion', stakeholders: 'Account Manager, Business Units', activities: 'Upsell opportunities, Cross-sell', status: 'pending' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  return (
    <div className="tab-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Journey Matrix Overview */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Customer Journey Matrix</h2>
            <p className="section-subtitle">
              Track stakeholder engagement and activities across the customer lifecycle
            </p>
          </div>
          <button className="btn-primary">Export Report</button>
        </div>

        {/* Journey Stages Table */}
        <div style={{ 
          overflowX: 'auto',
          marginTop: '24px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ 
                  padding: mobile ? '12px' : '16px', 
                  textAlign: 'left', 
                  fontSize: mobile ? '12px' : '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  borderBottom: '2px solid #e5e7eb'
                }}>Stage</th>
                <th style={{ 
                  padding: mobile ? '12px' : '16px', 
                  textAlign: 'left', 
                  fontSize: mobile ? '12px' : '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  borderBottom: '2px solid #e5e7eb'
                }}>Key Stakeholders</th>
                <th style={{ 
                  padding: mobile ? '12px' : '16px', 
                  textAlign: 'left', 
                  fontSize: mobile ? '12px' : '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  borderBottom: '2px solid #e5e7eb'
                }}>Activities</th>
                <th style={{ 
                  padding: mobile ? '12px' : '16px', 
                  textAlign: 'left', 
                  fontSize: mobile ? '12px' : '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  borderBottom: '2px solid #e5e7eb'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {journeyStages.map((journey, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ 
                    padding: mobile ? '12px' : '16px',
                    fontSize: mobile ? '12px' : '14px',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    {journey.stage}
                  </td>
                  <td style={{ 
                    padding: mobile ? '12px' : '16px',
                    fontSize: mobile ? '11px' : '13px',
                    color: '#6b7280'
                  }}>
                    {journey.stakeholders}
                  </td>
                  <td style={{ 
                    padding: mobile ? '12px' : '16px',
                    fontSize: mobile ? '11px' : '13px',
                    color: '#6b7280'
                  }}>
                    {journey.activities}
                  </td>
                  <td style={{ 
                    padding: mobile ? '12px' : '16px'
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: mobile ? '10px' : '11px',
                      fontWeight: 600,
                      backgroundColor: getStatusColor(journey.status) + '20',
                      color: getStatusColor(journey.status)
                    }}>
                      {getStatusLabel(journey.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stakeholder Engagement */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Stakeholder Engagement Status</h2>
            <p className="section-subtitle">
              Track engagement level across different personas
            </p>
          </div>
        </div>

        <div className={`opportunity-cards ${mobile || tablet ? 'mobile' : ''}`}>
          {[
            { persona: 'Economic Buyer', name: 'CFO - John Smith', engagement: 'High', lastContact: '2 days ago', color: '#10b981' },
            { persona: 'Technical Buyer', name: 'CTO - Sarah Lee', engagement: 'Medium', lastContact: '1 week ago', color: '#f59e0b' },
            { persona: 'Champion', name: 'VP Operations - Mike Johnson', engagement: 'High', lastContact: '1 day ago', color: '#10b981' },
            { persona: 'User Buyer', name: 'Department Head - Lisa Chen', engagement: 'Low', lastContact: '2 weeks ago', color: '#ef4444' }
          ].map((stakeholder, idx) => (
            <div key={idx} style={{
              padding: mobile ? '16px' : '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: mobile ? '14px' : '16px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                  {stakeholder.persona}
                </h3>
                <p style={{ fontSize: mobile ? '12px' : '13px', color: '#6b7280', margin: 0 }}>
                  {stakeholder.name}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: mobile ? '11px' : '12px', color: '#6b7280' }}>Engagement:</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: mobile ? '10px' : '11px',
                  fontWeight: 600,
                  backgroundColor: stakeholder.color + '20',
                  color: stakeholder.color
                }}>
                  {stakeholder.engagement}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: mobile ? '11px' : '12px', color: '#6b7280' }}>Last Contact:</span>
                <span style={{ fontSize: mobile ? '11px' : '12px', color: '#1f2937', fontWeight: 500 }}>
                  {stakeholder.lastContact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Best Actions */}
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Next Best Actions</h2>
            <p className="section-subtitle">
              Recommended actions to advance the customer journey
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { 
              action: 'Schedule executive alignment meeting',
              priority: 'High',
              owner: 'Account Manager',
              dueDate: 'This Week'
            },
            { 
              action: 'Prepare technical validation session',
              priority: 'High',
              owner: 'Solutions Architect',
              dueDate: 'Next Week'
            },
            { 
              action: 'Follow up with low-engagement stakeholders',
              priority: 'Medium',
              owner: 'Sales Team',
              dueDate: 'This Week'
            },
            { 
              action: 'Share customer success stories',
              priority: 'Medium',
              owner: 'Account Manager',
              dueDate: 'Next Week'
            }
          ].map((action, idx) => (
            <div key={idx} style={{
              padding: mobile ? '16px' : '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: mobile ? 'flex-start' : 'center',
              flexDirection: mobile ? 'column' : 'row',
              gap: mobile ? '12px' : '0'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: mobile ? '13px' : '14px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                  {action.action}
                </h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: mobile ? '11px' : '12px', color: '#6b7280' }}>
                    Owner: <strong>{action.owner}</strong>
                  </span>
                  <span style={{ fontSize: mobile ? '11px' : '12px', color: '#6b7280' }}>
                    Due: <strong>{action.dueDate}</strong>
                  </span>
                </div>
              </div>
              <span style={{
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: mobile ? '10px' : '11px',
                fontWeight: 600,
                backgroundColor: action.priority === 'High' ? '#fef3c7' : '#dbeafe',
                color: action.priority === 'High' ? '#d97706' : '#2563eb',
                whiteSpace: 'nowrap'
              }}>
                {action.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyMatrixTab;

