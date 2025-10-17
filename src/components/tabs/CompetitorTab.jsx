import React from 'react';
import './TabStyles.css';

const CompetitorTab = ({ mobile, tablet }) => {
  return (
    <div className="tab-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="tab-section">
        <div className={`section-header ${mobile ? 'mobile' : ''}`}>
          <div>
            <h2 className="section-title">Competitor Analysis Hub</h2>
            <p className="section-subtitle">
              Comprehensive activities to analyze competitors and develop strategic insights
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L1 15h14L8 1z" fill="currentColor"/>
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className={`stats-grid ${mobile || tablet ? 'mobile' : ''}`} style={{ gridTemplateColumns: mobile || tablet ? '1fr' : 'repeat(3, 1fr)' }}>
          <div className="stat-card blue">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#1890ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                👁️
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                Active Competitors
              </div>
            </div>
            <div className="stat-value">12</div>
            <div className="stat-label">Identified this quarter</div>
          </div>

          <div className="stat-card green">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#52c41a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                📋
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                Analysis Tasks
              </div>
            </div>
            <div className="stat-value">8</div>
            <div className="stat-label">In progress</div>
          </div>

          <div className="stat-card orange">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#fa8c16',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                📄
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a' }}>
                Reports Generated
              </div>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">This month</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={`analysis-grid ${mobile || tablet ? 'mobile' : ''}`}>
          {/* Analysis Activities */}
          <div className="analysis-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ marginBottom: 0 }}>Analysis Activities</h3>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>+ New Activity</button>
            </div>
            
            {/* Activity Items */}
            {[
              {
                title: 'Market Research & Intelligence',
                status: 'In Progress',
                description: 'Gather comprehensive market data',
                tasks: [
                  { text: 'Industry reports analysis', completed: true },
                  { text: 'Market size evaluation', completed: true },
                  { text: 'Trend identification', completed: false }
                ],
                statusColor: '#1890ff'
              },
              {
                title: 'Competitor Identification',
                status: 'Completed',
                description: 'Map direct and indirect competitors',
                tasks: [
                  { text: 'Direct competitors mapping', completed: true },
                  { text: 'Indirect competitors analysis', completed: true },
                  { text: 'Emerging players research', completed: true }
                ],
                statusColor: '#52c41a'
              },
              {
                title: 'Product/Service Analysis',
                status: 'Pending',
                description: 'Deep dive into competitor offerings',
                tasks: [
                  { text: 'Feature comparison matrix', completed: false },
                  { text: 'Pricing strategy analysis', completed: false },
                  { text: 'Value proposition mapping', completed: false }
                ],
                statusColor: '#d9d9d9'
              }
            ].map((activity, idx) => (
              <div key={idx} style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                background: '#fafafa',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    {activity.title}
                  </h4>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    backgroundColor: `${activity.statusColor}20`,
                    color: activity.statusColor
                  }}>
                    {activity.status}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#666666', marginBottom: '12px' }}>
                  {activity.description}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activity.tasks.map((task, taskIdx) => (
                    <div key={taskIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: task.completed ? '#52c41a' : '#d9d9d9', fontSize: '12px' }}>
                        {task.completed ? '✓' : '○'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#666666' }}>{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Competitor Profiles */}
          <div className="analysis-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="subsection-title" style={{ marginBottom: 0 }}>Competitor Profiles</h3>
              <button style={{
                padding: '4px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '11px'
              }}>
                Filter
              </button>
            </div>

            {/* Profile Cards */}
            {[
              {
                name: 'Acme Corporation',
                type: 'Direct Competitor',
                typeColor: '#1890ff',
                revenue: '$2.5B Revenue',
                employees: '500+ Employees',
                region: 'North America',
                marketShare: '23%',
                date: 'Jan 15, 2025'
              },
              {
                name: 'TechSolutions Inc',
                type: 'Indirect Competitor',
                typeColor: '#fa8c16',
                revenue: '$1.8B Revenue',
                employees: '350+ Employees',
                region: 'Global',
                marketShare: '18%',
                date: 'Jan 12, 2025'
              },
              {
                name: 'InnovatePro',
                type: 'Emerging Player',
                typeColor: '#52c41a',
                revenue: '$450M Revenue',
                employees: '150+ Employees',
                region: 'Europe',
                marketShare: '8%',
                date: 'Jan 10, 2025'
              }
            ].map((profile, idx) => (
              <div key={idx} style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                background: '#fafafa',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                    {profile.name}
                  </h4>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    backgroundColor: `${profile.typeColor}20`,
                    color: profile.typeColor
                  }}>
                    {profile.type}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>💰</span>
                    <span style={{ fontSize: '11px', color: '#666666' }}>{profile.revenue}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>👥</span>
                    <span style={{ fontSize: '11px', color: '#666666' }}>{profile.employees}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px' }}>🌍</span>
                    <span style={{ fontSize: '11px', color: '#666666' }}>{profile.region}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#666666' }}>
                    Market Share: <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{profile.marketShare}</span>
                  </span>
                  <span style={{ fontSize: '10px', color: '#999999' }}>{profile.date}</span>
                </div>
              </div>
            ))}

            {/* Quick Analysis Tools */}
            <div style={{
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: 'white',
              marginTop: '20px'
            }}>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
                Quick Analysis Tools
              </h4>
              <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: '8px', flexWrap: 'wrap' }}>
                {['SWOT Analysis', 'Trend Analysis', 'Position Map', 'Report Builder'].map((tool) => (
                  <button key={tool} style={{
                    padding: '6px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '4px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '11px',
                    flex: mobile ? '1' : '0 1 auto'
                  }}>
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorTab;

