import React, { useState } from 'react';
import { Modal, Table, Button, Input, Tag, Space, Form, Select, message, Switch } from 'antd';
import { EditOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const { TextArea } = Input;
const { Option } = Select;
import OrganizationDetailsTab from './tabs/OrganizationDetailsTab';
import ProfileTab from './tabs/ProfileTab';
import './UnifiedPopup.css';

const UnifiedPopup = ({ isVisible, onClose, activeScreen, onScreenChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
        top: isMobile ? '10px' : '20px',
        zIndex: 1000
      }}
      footer={null}
      destroyOnClose
      className="unified-popup-modal"
      closable={true}
      maskStyle={{ zIndex: 999 }}
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
            {['Organization Details', 'Service Manager', 'Profile', 'Suggestions', 'Settings', 'Help'].map((tab) => {
              // Mobile: Use Tag component
              if (isMobile) {
                return (
                  <Tag
                    key={tab}
                    color={activeScreen === tab ? '#201F47' : 'default'}
                    onClick={() => onScreenChange(tab)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      border: activeScreen === tab ? '1px solid #201F47' : '1px solid #d9d9d9',
                      color: activeScreen === tab ? '#fff' : '#666',
                      fontWeight: activeScreen === tab ? '500' : '400',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab}
                  </Tag>
                );
              }
              // Desktop: Use existing div styling
              return (
                <div 
                  key={tab}
                  className={`popup-tab ${activeScreen === tab ? 'active' : ''}`}
                  style={{ 
                    padding: '12px 16px', 
                    cursor: 'pointer',
                    backgroundColor: activeScreen === tab ? '#201F47' : 'transparent',
                    color: activeScreen === tab ? '#fff' : '#333',
                    borderRadius: '0',
                    fontSize: '14px',
                    fontWeight: activeScreen === tab ? '500' : '400',
                    border: 'none',
                    borderRight: activeScreen === tab ? '3px solid #1890ff' : 'none',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    width: '100%',
                    textAlign: 'left',
                    marginBottom: '4px'
                  }}
                  onClick={() => onScreenChange(tab)}
                  onMouseEnter={(e) => {
                    if (activeScreen !== tab) {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.color = '#201F47';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeScreen !== tab) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                    } else {
                      e.target.style.backgroundColor = '#201F47';
                      e.target.style.color = '#fff';
                    }
                  }}
                >
                  <span>{tab}</span>
                </div>
              );
            })}
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
  const [addForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
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

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Government', 'Energy', 'Other'
  ];

  const functionOptions = [
    'Sales', 'Marketing', 'Operations', 'Finance', 'IT/Technology',
    'Customer Service', 'Product Management', 'Other'
  ];

  const targetSegmentOptions = ['Small', 'Medium', 'Large', 'Startups'];

  const handleModalOk = async () => {
    try {
      const values = await addForm.validateFields();
      const newData = {
        key: Date.now().toString(),
        ...values,
      };
      const updatedData = [...dataSource, newData];
      setDataSource(updatedData);
      addForm.resetFields();
      setIsModalVisible(false);
      message.success('Service added successfully');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleModalCancel = () => {
    addForm.resetFields();
    setIsModalVisible(false);
  };

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
            onClick={() => setIsModalVisible(true)}
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

      <Modal
        title="Add New Service"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="interests"
            label="Product/Service Offerings"
            rules={[{ required: true, message: 'Please select offerings' }]}
          >
            <Select
              mode="tags"
              placeholder="Select or type offerings"
              tokenSeparators={[',']}
            >
              {interestList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="keywords"
            label="Keywords"
          >
            <Select
              mode="tags"
              placeholder="Select or type keywords"
              tokenSeparators={[',']}
            >
              {keywordList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="targetIndustry"
            label="Target Industry"
          >
            <Select 
              mode="multiple"
              placeholder="Select industries"
            >
              {industryOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="functionType"
            label="Function"
          >
            <Select 
              mode="multiple"
              placeholder="Select functions"
            >
              {functionOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="targetSegment"
            label="Target Segment(s)"
          >
            <Select
              mode="multiple"
              placeholder="Select segments"
            >
              {targetSegmentOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="offerStatus"
            label="Status"
            valuePropName="checked"
            getValueFromEvent={(checked) => checked ? 'Active' : 'Inactive'}
            getValueProps={(value) => ({ checked: value === 'Active' })}
            initialValue="Active"
          >
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


export default UnifiedPopup;
