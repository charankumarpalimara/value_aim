import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Select, Tag, Space, Form, Switch, message } from 'antd';
import { EditOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import OrganizationDetailsTab from './tabs/OrganizationDetailsTab';
import ProfileTab from './tabs/ProfileTab';
import './UnifiedPopup.css';

const UnifiedPopup = ({ isVisible, onClose, activeScreen, onScreenChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  const renderContent = () => {
    switch (activeScreen) {
      case 'Service Manager':
        return <ServiceManagerContent />;
      case 'Organization Details':
        return <OrganizationDetailsTab />;
      case 'Profile':
        return <ProfileTab />;
      case 'Suggestions':
        return (
          <div style={{ padding: '24px' }}>
            <h3>Suggestions</h3>
            <p>Suggestions content will be implemented here.</p>
          </div>
        );
      case 'Settings':
        return (
          <div style={{ padding: '24px' }}>
            <h3>Settings</h3>
            <p>Settings content will be implemented here.</p>
          </div>
        );
      case 'Help':
        return (
          <div style={{ padding: '24px' }}>
            <h3>Help</h3>
            <p>Help content will be implemented here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={activeScreen}
      open={isVisible}
      onCancel={onClose}
      width={isMobile ? "95%" : "60%"}
      style={{ 
        maxWidth: isMobile ? '95%' : '1400px', 
        top: isMobile ? '10px' : '20px' 
      }}
      footer={null}
      destroyOnClose
      className="unified-popup-modal"
      closable={true}
    >
      <div style={{ display: 'flex', height: '70vh', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Sidebar */}
        <div style={{ 
          width: isMobile ? '100%' : '200px', 
          borderRight: isMobile ? 'none' : '1px solid #e8e8e8',
          borderBottom: isMobile ? '1px solid #e8e8e8' : 'none',
          padding: isMobile ? '16px' : '16px 0',
          backgroundColor: '#fafafa',
          maxHeight: isMobile ? 'auto' : 'none',
          overflow: 'visible',
          zIndex: 10,
          position: 'relative'
        }}>
          <div style={{ 
            display: isMobile ? 'flex' : 'block',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '8px' : '0',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {['Organization Details', 'Service Manager', 'Profile', 'Suggestions', 'Settings', 'Help'].map((tab) => (
              <div 
                key={tab}
                className={`popup-tab ${activeScreen === tab ? 'active' : ''}`}
                style={{ 
                  padding: isMobile ? '8px 12px' : '12px 16px', 
                  cursor: 'pointer',
                  backgroundColor: activeScreen === tab ? '#201F47' : 'transparent',
                  color: activeScreen === tab ? '#fff' : '#333',
                  borderRadius: isMobile ? '16px' : '0',
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: activeScreen === tab ? '500' : '400',
                  border: 'none',
                  borderRight: isMobile ? 'none' : (activeScreen === tab ? '3px solid #1890ff' : 'none'),
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  minWidth: 'fit-content',
                  width: isMobile ? 'auto' : '100%',
                  textAlign: isMobile ? 'center' : 'left',
                  marginBottom: isMobile ? '0' : '4px'
                }}
                onClick={() => onScreenChange(tab)}
                onMouseEnter={(e) => {
                  if (!isMobile && activeScreen !== tab) {
                    e.target.style.backgroundColor = '#f5f5f5';
                    e.target.style.color = '#201F47';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    if (activeScreen !== tab) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                    } else {
                      e.target.style.backgroundColor = '#201F47';
                      e.target.style.color = '#fff';
                    }
                  }
                }}
              >
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '0'
        }}>
          {renderContent()}
        </div>
      </div>
    </Modal>
  );
};

// Service Manager Content Component (without header)
const ServiceManagerContent = () => {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState({ key: '', dataIndex: '' });
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const interestList = [
    'Cloud Migration', 'AI/ML Solutions', 'Cybersecurity Services',
    'Voice AI', 'Data Platform', 'Cloud Security', 'FinOps',
    'AI Ops', 'Intelligent Automation', 'Managed Security',
    'Zero Trust', 'Conversational Analytics', 'Multilingual Bots',
    'AI/ML Use Cases', 'Data Governance'
  ];

  const keywordList = [
    'Cost Savings', 'Agility', 'Revenue Growth', 'Innovation',
    'Risk Reduction', 'Compliance', 'Customer Experience', 'Decision Making'
  ];

  const columns = [
    {
      title: 'Product/Service Offerings',
      dataIndex: 'interests',
      key: 'interests',
      width: 180,
      render: (interests) => (
        <Space wrap>
          {interests?.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 150,
      render: (keywords) => (
        <Space wrap>
          {keywords?.map(tag => <Tag key={tag} color="green">{tag}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'offerStatus',
      key: 'offerStatus',
      width: 120,
      render: (text) => <Tag color={text === 'Active' ? 'green' : 'red'}>{text || 'Unknown'}</Tag>,
    },
  ];

  const filteredData = dataSource.filter((item) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      item.interests?.some(i => i.toLowerCase().includes(searchLower)) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchLower)) ||
      item.offerStatus?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
          Manage your service offerings, keywords, and target segments
        </h3>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
          {dataSource.length === 0 ? 'No services added yet. Click "Add New Service" to get started.' : `${dataSource.length} service(s) configured.`}
        </p>
      </div>

      <div style={{ 
        marginBottom: '24px', 
        display: 'flex', 
        justifyContent: isMobile ? 'flex-start' : 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px' 
      }}>
        <Input
          placeholder="Search services..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ 
            maxWidth: isMobile ? '100%' : '400px',
            width: isMobile ? '100%' : 'auto'
          }}
          allowClear
        />
        <Space 
          style={{ 
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'flex-start' : 'flex-end'
          }}
          wrap={isMobile}
        >
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            Add New Service
          </Button>
          <Button
            type={isEditMode ? "default" : "primary"}
            icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            {isEditMode ? 'Done Editing' : 'Edit Services'}
          </Button>
        </Space>
      </div>

      <Form form={form} component={false}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1500 }}
          bordered
          size="middle"
          style={{ width: '100%' }}
        />
      </Form>
    </div>
  );
};


export default UnifiedPopup;
