import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Select, Tag, Space, Form, Modal, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { serviceAPI } from '../utils/api';
import './ServiceDetailsForm.css';
import logo from '../assets/Amplify-Value-as-subtitle-3.png';

const { TextArea } = Input;
const { Option } = Select;

const ServiceDetailsForm = ({ onNext, onBack }) => {
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isAddConfirmModalVisible, setIsAddConfirmModalVisible] = useState(false);
  const [isMultiDeleteConfirmModalVisible, setIsMultiDeleteConfirmModalVisible] = useState(false);
  const [isDoneEditingConfirmModalVisible, setIsDoneEditingConfirmModalVisible] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const interestList = [
    'Cloud Migration',
    'AI/ML Solutions', 
    'Cybersecurity Services',
    'Voice AI',
    'Data Platform',
    'Cloud Security',
    'FinOps',
    'AI Ops',
    'Intelligent Automation',
    'Managed Security',
    'Zero Trust',
    'Conversational Analytics',
    'Multilingual Bots',
    'AI/ML Use Cases',
    'Data Governance',
    'Cost Savings',
    'Agility',
    'Revenue Growth',
    'Innovation',
    'Risk Reduction',
    'Compliance',
    'Customer Experience',
    'Decision Making'
  ];

  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Energy',
    'Telecommunications',
    'Transportation',
    'Real Estate',
    'Media & Entertainment',
    'Agriculture',
    'Construction',
    'Automotive',
    'Aerospace',
    'Pharmaceuticals',
    'Banking',
    'Insurance',
    'Consulting',
    'Legal Services',
    'Non-Profit',
    'Other'
  ];

  const functionOptions = [
    'Sales',
    'Marketing',
    'Operations',
    'Finance',
    'Human Resources',
    'IT/Technology',
    'Customer Service',
    'Product Management',
    'Business Development',
    'Strategy',
    'Legal',
    'Compliance',
    'Research & Development',
    'Supply Chain',
    'Quality Assurance',
    'Other'
  ];

  const targetSegmentOptions = [
    'Small',
    'Medium',
    'Large',
    'Startups'
  ];

  const keywordList = [
    'Cost Savings',
    'Agility',
    'Revenue Growth',
    'Innovation',
    'Risk Reduction',
    'Compliance',
    'Customer Experience',
    'Decision Making'
  ];

  const adjacencyExpansionList = [
    'Cloud Security',
    'FinOps',
    'AI Ops',
    'Intelligent Automation',
    'Managed Security',
    'Zero Trust',
    'Conversational Analytics',
    'Multilingual Bots',
    'AI/ML Use Cases',
    'Data Governance'
  ];

  const handleInlineEdit = (record, field, value) => {
    console.log('Storing pending change:', { key: record.key, field, value });
    
    // Store the change in pendingChanges state
    setPendingChanges(prev => ({
      ...prev,
      [record.key]: {
        ...prev[record.key],
        [field]: value
      }
    }));

    // Update the local dataSource to reflect the change in UI
    setDataSource(prevData => 
      prevData.map(item => 
        item.key === record.key 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const toggleEditMode = () => {
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

  const handleCancelDoneEditing = () => {
    // Discard changes and reload original data
    setIsDoneEditingConfirmModalVisible(false);
    setPendingChanges({});
    setIsEditMode(false);
    setSelectedRowKeys([]);
    // Reload original data - in this case, we'll just reset from a backup or reload
    message.info('Changes discarded');
  };

  const confirmDoneEditing = () => {
    try {
      // Check if there are any pending changes
      if (Object.keys(pendingChanges).length === 0) {
        setIsEditMode(false);
        setSelectedRowKeys([]);
        setIsDoneEditingConfirmModalVisible(false);
        message.info('No changes to save');
        return;
      }

      console.log('Applying pending changes:', pendingChanges);

      // Apply all pending changes to the dataSource
      const updatedData = dataSource.map(item => {
        if (pendingChanges[item.key]) {
          return { ...item, ...pendingChanges[item.key] };
        }
        return item;
      });

      setDataSource(updatedData);
      setIsEditMode(false);
      setSelectedRowKeys([]);
      setIsDoneEditingConfirmModalVisible(false);
      setPendingChanges({});
      message.success('All changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      setIsDoneEditingConfirmModalVisible(false);
      message.error('Failed to save some changes. Please try again.');
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      await addForm.validateFields();
      // Show confirmation modal instead of directly adding
      setIsAddConfirmModalVisible(true);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const confirmAddService = async () => {
    const values = addForm.getFieldsValue();
    const newData = {
      key: Date.now().toString(),
      ...values,
    };
    setDataSource([...dataSource, newData]);
    addForm.resetFields();
    setIsModalVisible(false);
    setIsAddConfirmModalVisible(false);
    setSelectedRowKeys([]);
    message.success('Service added successfully!');
  };

  const handleSelectedDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select services to delete');
      return;
    }
    setIsMultiDeleteConfirmModalVisible(true);
  };

  const confirmMultiDelete = () => {
    const newData = dataSource.filter(item => !selectedRowKeys.includes(item.key));
    setDataSource(newData);
    setIsMultiDeleteConfirmModalVisible(false);
    message.success(`${selectedRowKeys.length} service(s) deleted successfully!`);
    setSelectedRowKeys([]);
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
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Service Data:', dataSource);
      
      // Check if there's any data to save
      if (dataSource.length === 0) {
        console.log('No service data to save, proceeding with empty data');
        message.info('No services to save, proceeding to next step');
        
        // Save empty data to session storage for form flow
        const formFlowData = JSON.parse(sessionStorage.getItem('formFlowData') || '{}');
        formFlowData.serviceDetails = { services: [] };
        sessionStorage.setItem('formFlowData', JSON.stringify(formFlowData));
        
        // Call the original onNext function if provided
        if (onNext) {
          onNext({ services: [] });
        } else {
          // Navigate to results page
          navigate('/results');
        }
        return;
      }
      
      // Save services to backend only if there's data
      const response = await serviceAPI.bulkCreate(dataSource);
      
      if (response.success) {
        console.log('Services saved successfully:', response.data);
        message.warning('Services saved successfully!');
        
        // Also save to session storage for form flow
        const formFlowData = JSON.parse(sessionStorage.getItem('formFlowData') || '{}');
        formFlowData.serviceDetails = { services: dataSource };
        sessionStorage.setItem('formFlowData', JSON.stringify(formFlowData));
        
        // Call the original onNext function if provided
        if (onNext) {
          onNext({ services: dataSource });
        } else {
          // Navigate to results page
          navigate('/results');
        }
      } else {
        throw new Error(response.message || 'Failed to save services');
      }
    } catch (error) {
      console.error('Error saving services:', error);
      message.error('Failed to save services. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter data based on search text
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

  const columns = [
    {
      title: 'Product/Service Offerings',
      dataIndex: 'interests',
      key: 'interests',
      width: 180,
      sorter: (a, b) => {
        const aStr = a.interests?.join(', ') || '';
        const bStr = b.interests?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 150,
      sorter: (a, b) => {
        const aStr = a.keywords?.join(', ') || '';
        const bStr = b.keywords?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 150,
      sorter: (a, b) => {
        const aStr = a.adjacencyExpansion?.join(', ') || '';
        const bStr = b.adjacencyExpansion?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 150,
      sorter: (a, b) => {
        const aStr = a.targetIndustry?.join(', ') || '';
        const bStr = b.targetIndustry?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 150,
      sorter: (a, b) => {
        const aStr = a.functionType?.join(', ') || '';
        const bStr = b.functionType?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 150,
      sorter: (a, b) => {
        const aStr = a.targetSegment?.join(', ') || '';
        const bStr = b.targetSegment?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
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
      width: 120,
      sorter: (a, b) => (a.offerStatus || '').localeCompare(b.offerStatus || ''),
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
      width: 200,
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
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
    //   render: (_, record) => (
    //     <Button 
    //       type="text" 
    //       danger 
    //       icon={<DeleteOutlined />}
    //       size="small"
    //       onClick={() => handleDelete(record.key)}
    //     />
    //   ),
    // },
    // {
    //   title: 'Status',
    //   key: 'status',
    //   width: 100,
    //   // fixed: 'right',
    //   sorter: (a, b) => {
    //     // Sort by modification status - you can customize this logic
    //     return 0; // All rows have same status for now
    //   },
    //   render: (_, record) => (
    //     <Tag color="blue">Saved</Tag>
    //   ),
    // },
  ];

  return (
    <div className="service-details-page">
      {/* Header */}
      <div className="service-header">
        <div className="service-logo-section">
          <img src={logo} alt="Logo" className="service-logo-image" />
        </div>
      </div>

      <div className="service-details-container">
        <div className="service-details-header">
          <h2>Service Details</h2>
          <p>Manage your service information in the table below</p>
        </div>

      <div className="service-details-actions" style={{ 
        marginBottom: 16, 
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
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{ width: '100%' }}
            >
              Add New Service
            </Button>
            <Button
              type={isEditMode ? "default" : "primary"}
              icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={toggleEditMode}
              style={{ width: '100%' }}
            >
              {isEditMode ? 'Done Editing' : 'Edit Services'}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              style={{ width: '100%' }}
              disabled={selectedRowKeys.length === 0}
              onClick={handleSelectedDelete}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          </div>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add New Service
            </Button>
            <Button
              type={isEditMode ? "default" : "primary"}
              icon={isEditMode ? <SaveOutlined /> : <EditOutlined />}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Done Editing' : 'Edit Services'}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={handleSelectedDelete}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          </Space>
        )}
      </div>

      <Form form={form} component={false}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="key"
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1500 }}
          bordered
          rowClassName="editable-row"
          size="middle"
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
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="interests"
              label="Product/Service Offerings"
              rules={[{ required: true, message: 'Please select or enter offerings' }]}
              style={{ flex: 1 }}
            >
              <Select
                mode="tags"
                placeholder="Select from list or type custom offerings"
                style={{ width: '100%' }}
                allowClear
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
              style={{ flex: 1 }}
            >
              <Select
                mode="tags"
                placeholder="Select from list or type custom keywords"
                style={{ width: '100%' }}
                allowClear
                tokenSeparators={[',']}
              >
                {keywordList.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="adjacencyExpansion"
              label="Adjacency Expansion"
              style={{ flex: 1 }}
            >
              <Select
                mode="multiple"
                placeholder="Select adjacency expansion"
                style={{ width: '100%' }}
              >
                {adjacencyExpansionList.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="targetIndustry"
              label="Target Industry"
              style={{ flex: 1 }}
            >
              <Select 
                mode="multiple"
                placeholder="Select target industries" 
                style={{ width: '100%' }}
              >
                {industryOptions.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="functionType"
              label="Function"
              style={{ flex: 1 }}
            >
              <Select 
                mode="multiple"
                placeholder="Select functions" 
                style={{ width: '100%' }}
              >
                {functionOptions.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="targetSegment"
              label="Target Segment(s)"
              style={{ flex: 1 }}
            >
              <Select
                mode="multiple"
                placeholder="Select target segments" 
                style={{ width: '100%' }}
              >
                {targetSegmentOptions.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Form.Item
              name="offerStatus"
              label="Offer Status"
              valuePropName="checked"
              getValueFromEvent={(checked) => checked ? 'Active' : 'Inactive'}
              getValueProps={(value) => ({ checked: value === 'Active' })}
              initialValue="Active"
              style={{ flex: 1 }}
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
              />
            </Form.Item>

            <div style={{ flex: 1 }}></div>
          </div>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>

        <div className="service-details-footer">
          <Button onClick={onBack} size="large">
            Back
          </Button>
          <Button 
            type="primary" 
            size="large" 
            loading={isSubmitting} 
            disabled={isSubmitting}
            onClick={() => setIsConfirmModalVisible(true)}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>

        {/* Confirmation Modal for Continue */}
        <Modal
          title="Save Service Details"
          open={isConfirmModalVisible}
          onOk={() => {
            setIsConfirmModalVisible(false);
            handleSubmit();
          }}
          onCancel={() => setIsConfirmModalVisible(false)}
          okText="Yes"
          cancelText="No"
          centered
        >
          <p>Are you sure you want to save and continue?</p>
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
        >
          <p>Are you sure you want to add this service?</p>
        </Modal>

        {/* Confirmation Modal for Delete Multiple Services */}
        <Modal
          title="Delete Selected Services"
          open={isMultiDeleteConfirmModalVisible}
          onOk={confirmMultiDelete}
          onCancel={() => setIsMultiDeleteConfirmModalVisible(false)}
          okText="Yes"
          cancelText="No"
          centered
        >
          <p>Are you sure you want to delete {selectedRowKeys.length} selected service(s)? This action cannot be undone.</p>
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
        >
          <p>Do you want to save all your changes?</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Click "Save" to save changes or "Discard" to cancel without saving.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceDetailsForm;
