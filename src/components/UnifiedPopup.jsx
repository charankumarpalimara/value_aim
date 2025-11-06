import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Input, Tag, Space, Form, Select, Switch, Upload, message } from 'antd';
import { EditOutlined, SaveOutlined, SearchOutlined, DeleteOutlined, PlusOutlined, PaperClipOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { serviceAPI, suggestionAPI, contactAPI } from '../utils/api';

const { TextArea } = Input;
const { Option } = Select;
import OrganizationDetailsTab from './tabs/OrganizationDetailsTab';
import ProfileTab from './tabs/ProfileTab';
import './UnifiedPopup.css';

const UnifiedPopup = ({ isVisible, onClose, activeScreen, onScreenChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const renderContent = () => {
    switch (activeScreen) {
      case 'Your Services/ Products':
        return <ServiceManagerContent />;
      case 'Organization Details':
        return <OrganizationDetailsTab />;
      case 'Profile':
        return <ProfileTab />;
      case 'Suggestions':
        return <SuggestionsContent />;
      case 'Settings':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Settings</h3>
            <p style={{ fontSize: '13px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Settings content will be implemented here.</p>
          </div>
        );
      case 'Help':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Help</h3>
            <p style={{ fontSize: '13px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Help content will be implemented here.</p>
          </div>
        );
      case 'Contact Us':
        return <ContactUsContent />;
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        // title={activeScreen}
        open={isVisible}
        onCancel={onClose}
        width={isMobile ? "95%" : "60%"}
        style={{
          maxWidth: isMobile ? '95%' : '1400px',
          top: isMobile ? '10px' : '20px',
          zIndex: 1000
        }}
        styles={{
          mask: { zIndex: 999 },
          header: { 
            borderBottom: 'none',
            padding: 0
          }
        }}
        footer={null}
        destroyOnHidden
        className="unified-popup-modal"
        closable={true}
        closeIcon={
          <CloseOutlined 
            style={{
              fontSize: '18px',
              color: '#666'
            }}
            className="unified-popup-close-icon"
          />
        }
      >
      <div style={{ display: 'flex', height: '75vh', maxHeight: '75vh', flexDirection: isMobile ? 'column' : 'row' }}>
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
          position: 'relative',
          flexShrink: 0
        }}>
          <div style={{
            display: isMobile ? 'flex' : 'block',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: isMobile ? '8px' : '0',
            justifyContent: isMobile ? 'center' : 'flex-start'
          }}>
            {['Organization Details', 'Your Services/ Products', 'Profile', 'Suggestions', 'Contact Us', 'Settings', 'Help'].map((tab) => {
              // Mobile: Use Tag component
              if (isMobile) {
                return (
                  <Tag
                    key={tab}
                    color={activeScreen === tab ? '#201F47' : 'default'}
                    onClick={() => onScreenChange(tab)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '11px',
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
                    fontSize: '12px',
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
                      e.target.style.backgroundColor = '#201F47';
                      e.target.style.color = '#fff';
                      e.target.style.fontWeight = '500';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeScreen !== tab) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#333';
                      e.target.style.fontWeight = '400';
                    } else {
                      e.target.style.backgroundColor = '#201F47';
                      e.target.style.color = '#fff';
                      e.target.style.fontWeight = '500';
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
          overflowX: 'auto',
          padding: '0',
          height: '100%',
          maxHeight: '100%',
          WebkitOverflowScrolling: 'touch'
        }}>
          {renderContent()}
        </div>
      </div>
    </Modal>
    </>
  );
};

// Service Manager Content Component (without header)
const ServiceManagerContent = () => {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddConfirmModalVisible, setIsAddConfirmModalVisible] = useState(false);
  const [isEditConfirmModalVisible, setIsEditConfirmModalVisible] = useState(false);
  const [isDoneEditingConfirmModalVisible, setIsDoneEditingConfirmModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isDoneEditingLoading, setIsDoneEditingLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({}); // Store pending inline edits
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isAboveMobile = useMediaQuery({ maxWidth: 1100 });

  // Load services from database on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      console.log('=== Loading services ===');
      const response = await serviceAPI.getAll();
      console.log('Load services response:', response);
      
      if (response.success) {
        // Add key property for Ant Design Table
        const servicesWithKeys = response.data.map((service, index) => ({
          ...service,
          key: service.id || `service-${index}`,
        }));
        console.log('Loaded', servicesWithKeys.length, 'services');
        setDataSource(servicesWithKeys);
      } else {
        console.error('Failed to load services:', response.message);
        message.error(`Failed to load services: ${response.message}`);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      message.error(`Error loading services: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

  const adjacencyExpansionList = [
    'Cloud Security', 'FinOps', 'AI Ops', 'Intelligent Automation',
    'Managed Security', 'Zero Trust', 'Conversational Analytics',
    'Multilingual Bots', 'AI/ML Use Cases', 'Data Governance'
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
      await addForm.validateFields();
      
      if (editingService) {
        setIsEditConfirmModalVisible(true);
      } else {
        setIsAddConfirmModalVisible(true);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
      
      // Show user-friendly error message
      if (errInfo.errorFields && errInfo.errorFields.length > 0) {
        const firstError = errInfo.errorFields[0];
        const fieldName = firstError.name[0];
        const errorMessage = firstError.errors[0];
        
        console.log('Field with error:', fieldName);
        console.log('Error message:', errorMessage);
        
        message.error(errorMessage || 'Please fill in all required fields');
      } else {
        message.error('Please fill in all required fields');
      }
    }
  };

  const confirmAddService = async () => {
    setIsAddLoading(true);
    try {
      console.log('=== Starting confirmAddService ===');
      const values = addForm.getFieldsValue();
      console.log('Form values:', values);
      
      const response = await serviceAPI.create(values);
      console.log('API response:', response);
      
      if (response.success) {
        console.log('Service added successfully - showing toast');
        addForm.resetFields();
        setIsModalVisible(false);
        setIsAddConfirmModalVisible(false);
        setEditingService(null);
        setSelectedRowKeys([]);
        
        // Show message BEFORE reloading
        message.success('Service added successfully!');
        
        // Reload services from database
        await loadServices();
      } else {
        console.error('API returned success=false:', response.message);
        throw new Error(response.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setIsAddConfirmModalVisible(false);
      message.error(`Failed to add service: ${error.message}`);
    } finally {
      setIsAddLoading(false);
    }
  };

  const confirmEditService = async () => {
    setIsEditLoading(true);
    try {
      console.log('=== Starting confirmEditService ===');
      const values = addForm.getFieldsValue();
      console.log('Updating service ID:', editingService.id, 'with values:', values);
      
      const response = await serviceAPI.update(editingService.id, values);
      console.log('API response:', response);
      
      if (response.success) {
        console.log('Service updated successfully - showing toast');
        addForm.resetFields();
        setIsModalVisible(false);
        setIsEditConfirmModalVisible(false);
        setEditingService(null);
        setSelectedRowKeys([]);
        
        // Show message BEFORE reloading
        message.success('Service updated successfully!');
        
        // Reload services from database
        await loadServices();
      } else {
        console.error('API returned success=false:', response.message);
        throw new Error(response.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setIsEditConfirmModalVisible(false);
      message.error(`Failed to update service: ${error.message}`);
    } finally {
      setIsEditLoading(false);
    }
  };



  const handleSelectedDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select services to delete');
      return;
    }
    setIsDeleteConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    setIsDeleteLoading(true);
    try {
      console.log('=== Starting confirmDelete ===');
      console.log('Selected row keys:', selectedRowKeys);
      
      // Delete selected services one by one
      const deletePromises = selectedRowKeys.map(key => {
        const service = dataSource.find(item => item.key === key);
        console.log('Deleting service:', service);
        return service ? serviceAPI.delete(service.id) : Promise.resolve({ success: false });
      });

      const results = await Promise.all(deletePromises);
      console.log('Delete results:', results);
      const successCount = results.filter(result => result.success).length;
      console.log('Success count:', successCount);

      if (successCount > 0) {
        setSelectedRowKeys([]);
        setIsDeleteConfirmModalVisible(false);
        
        // Show message BEFORE reloading
        message.success(`${successCount} service(s) deleted successfully!`);
        
        // Reload services from database
        await loadServices();
      } else {
        throw new Error('Failed to delete selected services');
      }
    } catch (error) {
      console.error('Error deleting selected services:', error);
      setIsDeleteConfirmModalVisible(false);
      message.error(`Failed to delete services: ${error.message}`);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Commented out as inline editing is being used instead
  // const handleEditService = (record) => {
  //   setEditingService(record);
  //   // Set form values for editing
  //   addForm.setFieldsValue({
  //     interests: record.interests,
  //     keywords: record.keywords,
  //     adjacencyExpansion: record.adjacencyExpansion,
  //     targetIndustry: record.targetIndustry,
  //     functionType: record.functionType,
  //     targetSegment: record.targetSegment,
  //     offerStatus: record.offerStatus,
  //     description: record.description
  //   });
  //   setIsModalVisible(true);
  // };

  const handleInlineEdit = (record, field, value) => {
    console.log('Storing pending change:', { id: record.id, field, value });
    
    // Store the change in pendingChanges state
    setPendingChanges(prev => ({
      ...prev,
      [record.id]: {
        ...prev[record.id],
        [field]: value
      }
    }));

    // Update the local dataSource to reflect the change in UI
    setDataSource(prevData => 
      prevData.map(item => 
        item.id === record.id 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Show confirmation modal when exiting edit mode
      if (Object.keys(pendingChanges).length > 0) {
        setIsDoneEditingConfirmModalVisible(true);
      } else {
        // No changes, just exit edit mode
        setIsEditMode(false);
        setSelectedRowKeys([]);
        message.info('Edit mode closed');
      }
    } else {
      // Enter edit mode directly and clear any previous pending changes
      setPendingChanges({});
      setIsEditMode(true);
      setSelectedRowKeys([]);
    }
  };

  const handleCancelDoneEditing = async () => {
    // Discard changes and reload original data
    setIsDoneEditingConfirmModalVisible(false);
    setPendingChanges({});
    setIsEditMode(false);
    setSelectedRowKeys([]);
    await loadServices(); // Reload original data from database
    message.info('Changes discarded');
  };

  const confirmDoneEditing = async () => {
    setIsDoneEditingLoading(true);
    try {
      console.log('=== Starting confirmDoneEditing ===');
      console.log('Pending changes:', pendingChanges);
      
      // Check if there are any pending changes
      if (Object.keys(pendingChanges).length === 0) {
        console.log('No changes to save');
        setIsEditMode(false);
        setSelectedRowKeys([]);
        setIsDoneEditingConfirmModalVisible(false);
        message.info('No changes to save');
        setIsDoneEditingLoading(false);
        return;
      }

      console.log('Saving', Object.keys(pendingChanges).length, 'service(s)');

      // Save all pending changes to the database
      const savePromises = Object.entries(pendingChanges).map(([serviceId, changes]) => {
        console.log('Updating service', serviceId, 'with:', changes);
        return serviceAPI.update(serviceId, changes);
      });

      const results = await Promise.all(savePromises);
      console.log('Save results:', results);
      const successCount = results.filter(result => result.success).length;
      console.log('Successfully saved:', successCount, 'of', results.length);

      if (successCount === results.length) {
        // All changes saved successfully
        setIsEditMode(false);
        setSelectedRowKeys([]);
        setIsDoneEditingConfirmModalVisible(false);
        setPendingChanges({}); // Clear pending changes
        
        // Show message BEFORE reloading
        message.success('All changes saved successfully!');
        
        await loadServices(); // Reload from database
      } else {
        throw new Error('Some changes failed to save');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setIsDoneEditingConfirmModalVisible(false);
      message.error(`Failed to save changes: ${error.message}`);
    } finally {
      setIsDoneEditingLoading(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      name: record.key,
    }),
  };

  const handleModalCancel = () => {
    addForm.resetFields();
    setIsModalVisible(false);
    setEditingService(null);
  };

  const columns = [
    {
      title: 'Product/Service Offerings',
      dataIndex: 'interests',
      key: 'interests',
      sorter: (a, b) => {
        const aStr = a.interests?.join(', ') || '';
        const bStr = b.interests?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      // filters: interestList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.interests?.includes(value),
      render: (interests, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="tags"
              defaultValue={interests}
              placeholder="Select or type offerings"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Interests changed:', value);
                handleInlineEdit(record, 'interests', value);
              }}
            >
              {interestList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {interests?.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
          </div>
        );
      },
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      sorter: (a, b) => {
        const aStr = a.keywords?.join(', ') || '';
        const bStr = b.keywords?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      // filters: keywordList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.keywords?.includes(value),
      render: (keywords, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="tags"
              defaultValue={keywords}
              placeholder="Select or type keywords"
              tokenSeparators={[',']}
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Keywords changed:', value);
                handleInlineEdit(record, 'keywords', value);
              }}
            >
              {keywordList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {keywords?.map(tag => <Tag key={tag} color="green">{tag}</Tag>)}
          </div>
        );
      },
    },
    {
      title: 'Adjacency Expansion',
      dataIndex: 'adjacencyExpansion',
      key: 'adjacencyExpansion',
      sorter: (a, b) => {
        const aStr = a.adjacencyExpansion?.join(', ') || '';
        const bStr = b.adjacencyExpansion?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      render: (adjacency, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="multiple"
              defaultValue={adjacency}
              placeholder="Select adjacency"
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Adjacency changed:', value);
                handleInlineEdit(record, 'adjacencyExpansion', value);
              }}
            >
              {adjacencyExpansionList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {adjacency?.map(tag => <Tag key={tag} color="purple">{tag}</Tag>)}
          </div>
        );
      },
    },
    {
      title: 'Target Industry',
      dataIndex: 'targetIndustry',
      key: 'targetIndustry',
      sorter: (a, b) => {
        const aStr = a.targetIndustry?.join(', ') || '';
        const bStr = b.targetIndustry?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      // filters: industryOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetIndustry?.includes(value),
      render: (industries, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="multiple"
              defaultValue={industries}
              placeholder="Select industries"
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Industries changed:', value);
                handleInlineEdit(record, 'targetIndustry', value);
              }}
            >
              {industryOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Array.isArray(industries) && industries.length > 0 ? industries.map(industry => (
              <Tag key={industry} color="cyan">{industry}</Tag>
            )) : '-'}
          </div>
        );
      },
    },
    {
      title: 'Function',
      dataIndex: 'functionType',
      key: 'functionType',
      sorter: (a, b) => {
        const aStr = a.functionType?.join(', ') || '';
        const bStr = b.functionType?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      // filters: functionOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.functionType?.includes(value),
      render: (functions, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="multiple"
              defaultValue={functions}
              placeholder="Select functions"
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Functions changed:', value);
                handleInlineEdit(record, 'functionType', value);
              }}
            >
              {functionOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Array.isArray(functions) && functions.length > 0 ? functions.map(func => (
              <Tag key={func} color="magenta">{func}</Tag>
            )) : '-'}
          </div>
        );
      },
    },
    {
      title: 'Target Segment(s)',
      dataIndex: 'targetSegment',
      key: 'targetSegment',
      sorter: (a, b) => {
        const aStr = a.targetSegment?.join(', ') || '';
        const bStr = b.targetSegment?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      // filters: targetSegmentOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetSegment?.includes(value),
      render: (text, record) => {
        if (isEditMode) {
          return (
            <Select
              mode="multiple"
              defaultValue={text}
              placeholder="Select segments"
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Segments changed:', value);
                handleInlineEdit(record, 'targetSegment', value);
              }}
            >
              {targetSegmentOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          );
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {Array.isArray(text) && text.length > 0 ? text.map(segment => (
              <Tag key={segment} color="orange">{segment}</Tag>
            )) : '-'}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'offerStatus',
      key: 'offerStatus',
      sorter: (a, b) => (a.offerStatus || '').localeCompare(b.offerStatus || ''),
      sortDirections: ['ascend', 'descend'],
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' }
      ],
      onFilter: (value, record) => record.offerStatus === value,
      render: (text, record) => {
        if (isEditMode) {
          return (
            <Select
              defaultValue={text}
              style={{ width: '100%' }}
              onChange={(value) => {
                console.log('Status changed:', value);
                handleInlineEdit(record, 'offerStatus', value);
              }}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          );
        }
        return <Tag color={text === 'Active' ? 'green' : 'red'}>{text || 'Unknown'}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => {
        if (isEditMode) {
          return (
            <TextArea
              defaultValue={text}
              rows={2}
              placeholder="Enter description"
              style={{ width: '100%' }}
              onBlur={(e) => {
                console.log('Description changed:', e.target.value);
                handleInlineEdit(record, 'description', e.target.value);
              }}
            />
          );
        }
        return text || '-';
      },
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   width: 100,
    //   render: (_, record) => {
    //     if (!isEditMode) {
    //       return (
    //         <Button
    //           type="text"
    //           icon={<EditOutlined />}
    //           size="small"
    //           onClick={() => handleEditService(record)}
    //           title="Edit Service"
    //         />
    //       );
    //     }
    //     return null;
    //   },
    // },
  ];

  const filteredData = dataSource.filter((item) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      item.interests?.some(i => i.toLowerCase().includes(searchLower)) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchLower)) ||
      item.adjacencyExpansion?.some(a => a.toLowerCase().includes(searchLower)) ||
      item.targetIndustry?.some(t => t.toLowerCase().includes(searchLower)) ||
      item.functionType?.some(f => f.toLowerCase().includes(searchLower)) ||
      item.targetSegment?.some(s => s.toLowerCase().includes(searchLower)) ||
      item.offerStatus?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div style={{
      padding: '24px',
      height: '100%',
      overflowY: 'auto',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <style>
        {`
          /* Force scrollbars to be visible on all browsers including Windows */
          .ant-table-wrapper {
            overflow-x: auto !important;
            overflow-y: visible !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .ant-table {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Show scrollbars on Windows */
          .ant-table-content {
            overflow-x: auto !important;
            overflow-y: visible !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          /* Custom scrollbar for WebKit browsers (Chrome, Safari, Edge) */
          .ant-table-content::-webkit-scrollbar {
            height: 12px !important;
            width: 12px !important;
          }
          
          .ant-table-content::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
            border-radius: 6px !important;
          }
          
          .ant-table-content::-webkit-scrollbar-thumb {
            background: #888 !important;
            border-radius: 6px !important;
          }
          
          .ant-table-content::-webkit-scrollbar-thumb:hover {
            background: #555 !important;
          }
          
          /* Firefox scrollbar */
          .ant-table-content {
            scrollbar-width: thin !important;
            scrollbar-color: #888 #f1f1f1 !important;
          }
          
          /* For mobile devices - ensure touch scrolling */
          @media (max-width: 768px) {
            .ant-table-wrapper,
            .ant-table,
            .ant-table-content {
              -webkit-overflow-scrolling: touch !important;
              overflow-x: auto !important;
            }
            
            /* Show scrollbar on mobile */
            .ant-table-content::-webkit-scrollbar {
              height: 8px !important;
              width: 8px !important;
            }
          }
          
          .no-hover-button:hover {
            background-color: inherit !important;
            border-color: inherit !important;
            color: inherit !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .no-hover-button.ant-btn-primary:hover {
            background-color: #1890ff !important;
            border-color: #1890ff !important;
            color: #fff !important;
          }
          .no-hover-button.ant-btn-danger:hover {
            background-color: #ff4d4f !important;
            border-color: #ff4d4f !important;
            color: #fff !important;
          }
          .no-hover-button.ant-btn-default:hover {
            background-color: #fff !important;
            border-color: #d9d9d9 !important;
            color: rgba(0, 0, 0, 0.88) !important;
          }
          .popup-tab:hover {
            color: #fff !important;
          }
          .popup-tab:hover span {
            color: #fff !important;
          }
          
          /* Fix table tags for all screen sizes - More specific selectors */
          .ant-table-tbody > tr > td .ant-tag {
            background: transparent !important;
            border: 1px solid #d9d9d9 !important;
            margin: 2px !important;
            padding: 2px 6px !important;
            color: #333 !important;
            cursor: default !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .ant-table-tbody > tr > td .ant-tag:hover {
            background: transparent !important;
            border-color: inherit !important;
            color: inherit !important;
            transform: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          /* Tags within Space components - More specific selectors */
          .ant-table-tbody > tr > td .ant-space .ant-tag {
            background: transparent !important;
            border: 1px solid #d9d9d9 !important;
            margin: 2px !important;
            padding: 2px 6px !important;
            color: #333 !important;
            cursor: default !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag:hover {
            background: transparent !important;
            border-color: inherit !important;
            color: inherit !important;
            transform: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          /* Override any Ant Design default tag styles */
          .ant-table-tbody > tr > td .ant-tag,
          .ant-table-tbody > tr > td .ant-space .ant-tag {
            background-color: transparent !important;
            background-image: none !important;
          }
          /* Force transparent background for all tag variants */
          .ant-table-tbody > tr > td .ant-tag.ant-tag-blue,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-green,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-red,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-purple,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-cyan,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-magenta,
          .ant-table-tbody > tr > td .ant-tag.ant-tag-orange,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-blue,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-green,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-red,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-purple,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-cyan,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-magenta,
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-orange {
            background-color: transparent !important;
            background-image: none !important;
            background: transparent !important;
          }
          /* Color overrides for all tag types - Direct tags */
          .ant-table-tbody > tr > td .ant-tag.ant-tag-blue,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(24, 144, 255)"] {
            color: #1890ff !important;
            border-color: #1890ff !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-blue:hover {
            background: transparent !important;
            color: #1890ff !important;
            border-color: #1890ff !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-green,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(82, 196, 26)"] {
            color: #52c41a !important;
            border-color: #52c41a !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-green:hover {
            background: transparent !important;
            color: #52c41a !important;
            border-color: #52c41a !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-red,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(255, 77, 79)"] {
            color: #ff4d4f !important;
            border-color: #ff4d4f !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-red:hover {
            background: transparent !important;
            color: #ff4d4f !important;
            border-color: #ff4d4f !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-purple,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(114, 46, 209)"] {
            color: #722ed1 !important;
            border-color: #722ed1 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-purple:hover {
            background: transparent !important;
            color: #722ed1 !important;
            border-color: #722ed1 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-cyan,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(19, 194, 194)"] {
            color: #13c2c2 !important;
            border-color: #13c2c2 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-cyan:hover {
            background: transparent !important;
            color: #13c2c2 !important;
            border-color: #13c2c2 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-magenta,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(235, 47, 150)"] {
            color: #eb2f96 !important;
            border-color: #eb2f96 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-magenta:hover {
            background: transparent !important;
            color: #eb2f96 !important;
            border-color: #eb2f96 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-orange,
          .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(250, 140, 22)"] {
            color: #fa8c16 !important;
            border-color: #fa8c16 !important;
          }
          .ant-table-tbody > tr > td .ant-tag.ant-tag-orange:hover {
            background: transparent !important;
            color: #fa8c16 !important;
            border-color: #fa8c16 !important;
          }
          /* Color overrides for all tag types - Tags within Space */
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-blue,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(24, 144, 255)"] {
            color: #1890ff !important;
            border-color: #1890ff !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-blue:hover {
            background: transparent !important;
            color: #1890ff !important;
            border-color: #1890ff !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-green,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(82, 196, 26)"] {
            color: #52c41a !important;
            border-color: #52c41a !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-green:hover {
            background: transparent !important;
            color: #52c41a !important;
            border-color: #52c41a !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-red,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(255, 77, 79)"] {
            color: #ff4d4f !important;
            border-color: #ff4d4f !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-red:hover {
            background: transparent !important;
            color: #ff4d4f !important;
            border-color: #ff4d4f !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-purple,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(114, 46, 209)"] {
            color: #722ed1 !important;
            border-color: #722ed1 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-purple:hover {
            background: transparent !important;
            color: #722ed1 !important;
            border-color: #722ed1 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-cyan,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(19, 194, 194)"] {
            color: #13c2c2 !important;
            border-color: #13c2c2 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-cyan:hover {
            background: transparent !important;
            color: #13c2c2 !important;
            border-color: #13c2c2 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-magenta,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(235, 47, 150)"] {
            color: #eb2f96 !important;
            border-color: #eb2f96 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-magenta:hover {
            background: transparent !important;
            color: #eb2f96 !important;
            border-color: #eb2f96 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-orange,
          .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(250, 140, 22)"] {
            color: #fa8c16 !important;
            border-color: #fa8c16 !important;
          }
          .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-orange:hover {
            background: transparent !important;
            color: #fa8c16 !important;
            border-color: #fa8c16 !important;
          }
          /* Fix Space components - Target the specific background issue */
          .ant-table-tbody > tr > td .ant-space {
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            display: inline !important;
            gap: 4px !important;
          }
          .ant-table-tbody > tr > td .ant-space-item {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: auto !important;
            height: auto !important;
            flex: none !important;
            display: inline !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-style: none !important;
            outline-color: transparent !important;
          }
          .ant-table-tbody > tr > td .ant-space-item:hover {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-style: none !important;
            outline-color: transparent !important;
            transform: none !important;
          }
          /* Specific override for the grey background issue */
          .ant-table-tbody > tr > td .ant-space .ant-space-item {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
          }
          /* Remove any pseudo-elements from space components */
          .ant-table-tbody > tr > td .ant-space::before,
          .ant-table-tbody > tr > td .ant-space::after,
          .ant-table-tbody > tr > td .ant-space-item::before,
          .ant-table-tbody > tr > td .ant-space-item::after {
            display: none !important;
          }
          
          /* Mobile responsive fixes for table tags */
          @media (max-width: 768px) {
            /* Direct tags (like Status column) */
            .ant-table-tbody > tr > td .ant-tag {
              background: transparent !important;
              border: 1px solid #d9d9d9 !important;
              margin: 2px !important;
              padding: 2px 6px !important;
              color: #333 !important;
              cursor: default !important;
            }
            .ant-table-tbody > tr > td .ant-tag:hover {
              background: transparent !important;
              border-color: inherit !important;
              color: inherit !important;
              transform: none !important;
              box-shadow: none !important;
            }
            /* Tags within Space components (like other columns) */
            .ant-table-tbody > tr > td .ant-space .ant-tag {
              background: transparent !important;
              border: 1px solid #d9d9d9 !important;
              margin: 2px !important;
              padding: 2px 6px !important;
              color: #333 !important;
              cursor: default !important;
              box-shadow: none !important;
              outline: none !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag:hover {
              background: transparent !important;
              border-color: inherit !important;
              color: inherit !important;
              transform: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
            /* Additional rules to remove any remaining background boxes */
            .ant-table-tbody > tr > td .ant-space .ant-tag::before,
            .ant-table-tbody > tr > td .ant-space .ant-tag::after {
              display: none !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag * {
              background: transparent !important;
              box-shadow: none !important;
            }
            /* Specific color overrides for all tag types - Direct tags */
            .ant-table-tbody > tr > td .ant-tag.ant-tag-blue,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(24, 144, 255)"] {
              color: #1890ff !important;
              border-color: #1890ff !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-blue:hover {
              background: transparent !important;
              color: #1890ff !important;
              border-color: #1890ff !important;
            }
            /* Specific color overrides for all tag types - Tags within Space */
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-blue,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(24, 144, 255)"] {
              color: #1890ff !important;
              border-color: #1890ff !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-blue:hover {
              background: transparent !important;
              color: #1890ff !important;
              border-color: #1890ff !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-green,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(82, 196, 26)"] {
              color: #52c41a !important;
              border-color: #52c41a !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-green:hover {
              background: transparent !important;
              color: #52c41a !important;
              border-color: #52c41a !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-green,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(82, 196, 26)"] {
              color: #52c41a !important;
              border-color: #52c41a !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-green:hover {
              background: transparent !important;
              color: #52c41a !important;
              border-color: #52c41a !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-red,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(255, 77, 79)"] {
              color: #ff4d4f !important;
              border-color: #ff4d4f !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-red:hover {
              background: transparent !important;
              color: #ff4d4f !important;
              border-color: #ff4d4f !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-red,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(255, 77, 79)"] {
              color: #ff4d4f !important;
              border-color: #ff4d4f !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-red:hover {
              background: transparent !important;
              color: #ff4d4f !important;
              border-color: #ff4d4f !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-purple,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(114, 46, 209)"] {
              color: #722ed1 !important;
              border-color: #722ed1 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-purple:hover {
              background: transparent !important;
              color: #722ed1 !important;
              border-color: #722ed1 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-purple,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(114, 46, 209)"] {
              color: #722ed1 !important;
              border-color: #722ed1 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-purple:hover {
              background: transparent !important;
              color: #722ed1 !important;
              border-color: #722ed1 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-cyan,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(19, 194, 194)"] {
              color: #13c2c2 !important;
              border-color: #13c2c2 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-cyan:hover {
              background: transparent !important;
              color: #13c2c2 !important;
              border-color: #13c2c2 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-cyan,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(19, 194, 194)"] {
              color: #13c2c2 !important;
              border-color: #13c2c2 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-cyan:hover {
              background: transparent !important;
              color: #13c2c2 !important;
              border-color: #13c2c2 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-magenta,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(235, 47, 150)"] {
              color: #eb2f96 !important;
              border-color: #eb2f96 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-magenta:hover {
              background: transparent !important;
              color: #eb2f96 !important;
              border-color: #eb2f96 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-magenta,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(235, 47, 150)"] {
              color: #eb2f96 !important;
              border-color: #eb2f96 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-magenta:hover {
              background: transparent !important;
              color: #eb2f96 !important;
              border-color: #eb2f96 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-orange,
            .ant-table-tbody > tr > td .ant-tag[style*="background-color: rgb(250, 140, 22)"] {
              color: #fa8c16 !important;
              border-color: #fa8c16 !important;
            }
            .ant-table-tbody > tr > td .ant-tag.ant-tag-orange:hover {
              background: transparent !important;
              color: #fa8c16 !important;
              border-color: #fa8c16 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-orange,
            .ant-table-tbody > tr > td .ant-space .ant-tag[style*="background-color: rgb(250, 140, 22)"] {
              color: #fa8c16 !important;
              border-color: #fa8c16 !important;
            }
            .ant-table-tbody > tr > td .ant-space .ant-tag.ant-tag-orange:hover {
              background: transparent !important;
              color: #fa8c16 !important;
              border-color: #fa8c16 !important;
            }
            .ant-table-tbody > tr > td .ant-space {
              margin: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              display: inline !important;
              gap: 4px !important;
            }
            .ant-table-tbody > tr > td .ant-space-item {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              width: auto !important;
              height: auto !important;
              flex: none !important;
              display: inline !important;
              outline: none !important;
            }
            /* Remove any pseudo-elements from space components */
            .ant-table-tbody > tr > td .ant-space::before,
            .ant-table-tbody > tr > td .ant-space::after,
            .ant-table-tbody > tr > td .ant-space-item::before,
            .ant-table-tbody > tr > td .ant-space-item::after {
              display: none !important;
            }
            /* Fix Space component in action buttons area */
            .ant-space {
              display: flex !important;
              gap: 8px !important;
            }
            .ant-space .ant-space-item {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              flex: none !important;
            }
          /* Additional comprehensive fix for any remaining space-item issues */
          * .ant-space-item {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            flex: none !important;
            width: auto !important;
            height: auto !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-style: none !important;
            outline-color: transparent !important;
          }
          * .ant-space-item:hover {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            border-color: transparent !important;
            box-shadow: none !important;
            outline: none !important;
            outline-width: 0 !important;
            outline-style: none !important;
            outline-color: transparent !important;
            transform: none !important;
          }
          /* Target the specific grey background issue from DevTools */
          .ant-table-tbody > tr > td .ant-space-item[style*="background-color: rgb(240, 240, 240)"],
          .ant-table-tbody > tr > td .ant-space-item[style*="background-color: #F0F0F0"],
          .ant-table-tbody > tr > td .ant-space-item[style*="background-color: #f0f0f0"] {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
            .ant-table-tbody > tr > td {
              padding: 8px !important;
            }
            .ant-table-thead > tr > th {
              padding: 8px !important;
            }
          }
        `}
      </style>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        Manage your Services and Products Offerings
        </h3>
        {/* <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '13px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          {dataSource.length === 0 ? 'No services added yet. Click "Add New Service" to get started.' : `${dataSource.length} service(s) configured.`}
        </p> */}
      </div>

      <div style={{
        marginBottom: '24px',
        display: 'flex',

        justifyContent: isMobile ? 'flex-start' : 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isAboveMobile ? 'column' : 'row',
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
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              style={{
                width: '100%',
                ':hover': { backgroundColor: 'transparent' }
              }}
              className="no-hover-button"
            >
              Add
            </Button>
            <Button
              type={isEditMode ? "default" : "primary"}
              icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={handleToggleEditMode}
              style={{
                width: '100%',
                ':hover': { backgroundColor: 'transparent' }
              }}
              className="no-hover-button"
            >
              {isEditMode ? 'Done Editing' : 'Edit'}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleSelectedDelete}
              style={{
                width: '100%',
                ':hover': { backgroundColor: 'transparent' }
              }}
              className="no-hover-button"
              disabled={selectedRowKeys.length === 0}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: isAboveMobile ? 'column' : 'row', gap: '8px', width: '100%' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="no-hover-button"
            >
              Add New
            </Button>
            <Button
              type={isEditMode ? "default" : "primary"}
              icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={handleToggleEditMode}
              className="no-hover-button"
            >
              {isEditMode ? 'Done Editing' : 'Edit'}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleSelectedDelete}
              className="no-hover-button"
              disabled={selectedRowKeys.length === 0}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          </div>
        )}
      </div>

      <Form form={form} component={false}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 'max-content', y: null }}
          bordered
          size="middle"
          style={{ width: '100%' }}
          filterMultiple={true}
          showSorterTooltip={false}
        />
      </Form>

      <Modal
        title={editingService ? "Edit Service" : "Add New Service"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingService ? "Update" : "Add"}
        cancelText="Cancel"
        styles={{
          body: {
            maxHeight: '450px',
            overflowY: 'auto',
            paddingRight: '8px',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
          }
        }}
        style={{
          top: 20
        }}
      >
        <style>
          {`
            .ant-modal-body::-webkit-scrollbar {
              display: none; /* Chrome, Safari and Opera */
            }
          `}
        </style>
        <Form 
          form={addForm} 
          layout="vertical"
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        >
          <Form.Item
            name="interests"
            label="Product/Service Offerings"
            rules={[{ required: true, message: 'Please select at least one Product/Service Offering' }]}
            required
            tooltip="This is a required field"
          >
            <Select
              mode="tags"
              placeholder="Select or type offerings (Required)"
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
            name="adjacencyExpansion"
            label="Adjacency Expansion"
          >
            <Select
              mode="multiple"
              placeholder="Select adjacency"
            >
              {adjacencyExpansionList.map(item => (
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

      {/* Confirmation Modal for Add Service */}
      <Modal
        title="Add Service"
        open={isAddConfirmModalVisible}
        onOk={confirmAddService}
        onCancel={() => setIsAddConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: isAddLoading }}
        cancelButtonProps={{ disabled: isAddLoading }}
      >
        <p>Are you sure you want to add this service?</p>
      </Modal>

      {/* Confirmation Modal for Edit Service */}
      <Modal
        title="Edit Service"
        open={isEditConfirmModalVisible}
        onOk={confirmEditService}
        onCancel={() => setIsEditConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: isEditLoading }}
        cancelButtonProps={{ disabled: isEditLoading }}
      >
        <p>Are you sure you want to update this service?</p>
      </Modal>

      {/* Confirmation Modal for Done Editing */}
      <Modal
        title="Save Changes"
        open={isDoneEditingConfirmModalVisible}
        onOk={confirmDoneEditing}
        onCancel={handleCancelDoneEditing}
        okText="Save"
        cancelText="Discard"
        centered
        okButtonProps={{ loading: isDoneEditingLoading }}
        cancelButtonProps={{ disabled: isDoneEditingLoading }}
      >
        <p>Do you want to save all your changes to the database?</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          Click "Save" to save changes or "Discard" to cancel without saving.
        </p>
      </Modal>

      {/* Confirmation Modal for Delete Selected Services */}
      <Modal
        title="Delete Selected Services"
        open={isDeleteConfirmModalVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: isDeleteLoading }}
        cancelButtonProps={{ disabled: isDeleteLoading }}
      >
        <p>Are you sure you want to delete {selectedRowKeys.length} selected service(s)?</p>
        <p style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '8px' }}>
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

// Suggestions Content Component
const SuggestionsContent = () => {
  const [suggestionText, setSuggestionText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const maxChars = 250;
  const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setSuggestionText(text);
      setCharCount(text.length);
    }
  };

  const handleFileSelect = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      message.error('File size must be less than 20MB');
      return false;
    }
    setAttachedFile(file);
    message.success(`📎 ${file.name} attached successfully`);
    return false; // Prevent auto upload
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    message.info('Attachment removed');
  };

  const handleSend = async () => {
    console.log('=== Starting handleSend (Suggestions) ===');
    
    if (!suggestionText.trim() && !attachedFile) {
      message.warning('Please enter a suggestion or attach a file to submit');
      return;
    }

    setIsSending(true);
    try {
      // Create FormData for sending
      const formData = new FormData();
      formData.append('suggestion', suggestionText);
      if (attachedFile) {
        formData.append('attachment', attachedFile);
      }
      
      console.log('Sending suggestion with text:', suggestionText, 'and file:', attachedFile?.name);

      // Call the backend API
      const response = await suggestionAPI.create(formData);
      console.log('Suggestion API response:', response);
      
      if (response.success) {
        console.log('Suggestion sent successfully - showing success modal');
        
        // Reset form
        setSuggestionText('');
        setCharCount(0);
        setAttachedFile(null);
        
        // Show success modal
        setIsSuccessModalVisible(true);
      } else {
        console.error('API returned success=false:', response.message);
        throw new Error(response.message || 'Failed to send suggestion');
      }
    } catch (error) {
      console.error('Error sending suggestion:', error);
      message.error(error.response?.data?.message || `Failed to send suggestion: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '18px', 
          fontWeight: '600', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
        }}>
          Share Your Suggestions
        </h3>
        <p style={{ 
          margin: '0 0 8px 0', 
          color: '#666', 
          fontSize: '13px', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
        }}>
          We'd love to hear your feedback and suggestions for improving our platform.
        </p>
        {/* <p style={{ 
          margin: '0', 
          color: '#1890ff', 
          fontSize: '12px', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontStyle: 'italic'
        }}>
          💡 You can submit a text suggestion, attach a file, or both. We value your input!
        </p> */}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Text Input Area */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Your Suggestion
          </label>
        <div style={{ position: 'relative' }}>
          <TextArea
            value={suggestionText}
            onChange={handleTextChange}
            placeholder="Type your suggestion here... (max 250 characters)"
            rows={6}
            style={{
              fontSize: '14px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              resize: 'none'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '12px',
            color: charCount >= maxChars ? '#ff4d4f' : '#999',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            {charCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* File Attachment Section */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Attachment (Optional)
          </label>
        <div style={{
          border: '1px dashed #d9d9d9',
          borderRadius: '4px',
          padding: '16px',
          backgroundColor: '#fafafa'
        }}>
          {!attachedFile ? (
            <Upload
              beforeUpload={handleFileSelect}
              showUploadList={false}
              accept="*"
            >
              <Button 
                icon={<PaperClipOutlined />}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              >
                Attach File (Max 20MB)
              </Button>
            </Upload>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <PaperClipOutlined style={{ color: '#1890ff' }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#333',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {attachedFile.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#999',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                  }}>
                    {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={handleRemoveFile}
                size="small"
                style={{ color: '#ff4d4f' }}
              />
            </div>
          )}
          <div style={{
            marginTop: '8px',
            fontSize: '12px',
            color: '#999',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Supported formats: All file types (Max size: 20MB)
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          {/* {(!suggestionText.trim() && !attachedFile) && (
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              backgroundColor: '#fff7e6',
              border: '1px solid #ffd666',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#faad14',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
              ℹ️ Please enter a suggestion or attach a file to submit
            </div>
          )} */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isSending}
            disabled={!suggestionText.trim() && !attachedFile}
            size="large"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '500'
            }}
          >
            {isSending ? 'Sending...' : 'Send Suggestion'}
          </Button>
        </div>
      </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalVisible}
        onOk={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
        footer={[
          <Button 
            key="ok" 
            type="primary" 
            size="large"
            onClick={() => setIsSuccessModalVisible(false)}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              minWidth: '120px'
            }}
          >
            Got it!
          </Button>
        ]}
        centered
        closable={false}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            fontSize: '56px', 
            marginBottom: '16px',
            animation: 'bounce 0.5s ease-in-out'
          }}>
            ✅
          </div>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#52c41a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Suggestion Received!
          </h3>
          <p style={{ 
            fontSize: '15px', 
            color: '#666',
            marginBottom: '12px',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Thank you for sharing your valuable feedback!
          </p>
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px',
            padding: '12px',
            marginTop: '16px'
          }}>
            <p style={{ 
              fontSize: '13px', 
              color: '#52c41a',
              margin: 0,
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
              💡 We appreciate your input and will carefully review your suggestion.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Contact Us Content Component
const ContactUsContent = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleSubmit = async (values) => {
    console.log('=== Starting handleSubmit (Contact Us) ===');
    console.log('Form values:', values);
    
    setIsSubmitting(true);
    try {
      const response = await contactAPI.create(values);
      console.log('Contact API response:', response);
      
      if (response.success) {
        console.log('Contact form submitted successfully - showing success modal');
        
        // Reset form
        form.resetFields();
        
        // Show success modal
        setIsSuccessModalVisible(true);
      } else {
        console.error('API returned success=false:', response.message);
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      message.error(error.response?.data?.message || error.message || `Failed to send message: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '18px', 
          fontWeight: '600', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
        }}>
          Contact Us
        </h3>
        <p style={{ 
          margin: '0', 
          color: '#666', 
          fontSize: '13px', 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
        }}>
          Have a question or need assistance? Fill out the form below and we'll get back to you.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.log('Form validation failed:', errorInfo);
          // Show user-friendly error message
          if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
            const firstError = errorInfo.errorFields[0];
            const errorMessage = firstError.errors[0];
            message.error(errorMessage || 'Please fill in all required fields correctly');
          }
        }}
        scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px' }}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
              required
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Enter your first name"
                maxLength={50}
                style={{
                  fontSize: '13px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
              required
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Enter your last name"
                maxLength={50}
                style={{
                  fontSize: '13px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Your Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid email format (e.g., example@domain.com)'
              }
            ]}
            required
            tooltip="Enter a valid email address"
            style={{ marginBottom: 0 }}
          >
            <Input
              type="email"
              placeholder="example@domain.com"
              maxLength={100}
              style={{
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Your Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { 
                pattern: /^[0-9+\-\s()]*$/, 
                message: 'Please enter only numbers' 
              },
              {
                min: 10,
                message: 'Phone number must be at least 10 digits'
              }
            ]}
            required
            tooltip="Enter your phone number (numbers only)"
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Enter your phone number (numbers only)"
              maxLength={15}
              onKeyPress={(e) => {
                // Allow only numbers, +, -, (, ), and space
                const allowedChars = /[0-9+\-\s()]/;
                if (!allowedChars.test(e.key)) {
                  e.preventDefault();
                }
              }}
              style={{
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter a subject' }]}
            required
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Enter the subject"
              maxLength={200}
              style={{
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: 'Please enter your message' },
              { min: 10, message: 'Message must be at least 10 characters' }
            ]}
            required
            tooltip="Minimum 10 characters"
            style={{ marginBottom: 0, flex: 1 }}
          >
            <TextArea
              rows={6}
              placeholder="Enter your message here... (min 10 characters)"
              maxLength={1000}
              showCount
              style={{
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                resize: 'none'
              }}
            />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            size="large"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '500',
              minWidth: '120px'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </Form>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalVisible}
        onOk={() => setIsSuccessModalVisible(false)}
        onCancel={() => setIsSuccessModalVisible(false)}
        footer={[
          <Button 
            key="ok" 
            type="primary" 
            size="large"
            onClick={() => setIsSuccessModalVisible(false)}
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              minWidth: '120px'
            }}
          >
            Got it!
          </Button>
        ]}
        centered
        closable={false}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            fontSize: '56px', 
            marginBottom: '16px',
            animation: 'bounce 0.5s ease-in-out'
          }}>
            ✅
          </div>
          <h3 style={{ 
            fontSize: '22px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#52c41a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Message Sent Successfully!
          </h3>
          <p style={{ 
            fontSize: '15px', 
            color: '#666',
            marginBottom: '12px',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            Thank you for reaching out to us!
          </p>
          <div style={{
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px',
            padding: '12px',
            marginTop: '16px'
          }}>
            <p style={{ 
              fontSize: '13px', 
              color: '#52c41a',
              margin: 0,
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}>
              📬 Our team will review your message and get back to you shortly.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};


export default UnifiedPopup;
