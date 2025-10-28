import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Input, Select, Tag, Space, Form, Modal, Switch, message, Popconfirm } from 'antd';
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
  const [editingCell, setEditingCell] = useState({ key: '', dataIndex: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  const isEditingCell = (record, dataIndex) => 
    isEditMode && editingCell.key === record.key && editingCell.dataIndex === dataIndex;

  const editCell = (record, dataIndex) => {
    if (!isEditMode) return; // Only allow editing if edit mode is on
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
    setEditingCell({ key: record.key, dataIndex });
  };

  const saveCell = async (key, dataIndex) => {
    try {
      const values = await form.validateFields([dataIndex]);
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...values });
        setDataSource(newData);
        setEditingCell({ key: '', dataIndex: '' });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setEditingCell({ key: '', dataIndex: '' });
    setSelectedRowKeys([]);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await addForm.validateFields();
      const newData = {
        key: Date.now().toString(),
        ...values,
      };
      setDataSource([...dataSource, newData]);
      addForm.resetFields();
      setIsModalVisible(false);
      setSelectedRowKeys([]);
      message.success('Service added successfully');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter(item => item.key !== key);
    setDataSource(newData);
    message.warning('Service deleted successfully');
  };

  const handleSelectedDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select services to delete');
      return;
    }
    const newData = dataSource.filter(item => !selectedRowKeys.includes(item.key));
    setDataSource(newData);
    setSelectedRowKeys([]);
    message.warning(`${selectedRowKeys.length} service(s) deleted successfully`);
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
        message.success('Services saved successfully!');
        
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
        const editable = isEditingCell(record, 'interests');
        return editable ? (
          <Form.Item
            name="interests"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select or type offerings"
              tokenSeparators={[',']}
              autoFocus
              onBlur={() => saveCell(record.key, 'interests')}
              onPressEnter={() => saveCell(record.key, 'interests')}
            >
              {interestList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'interests')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {interests?.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
            </Space>
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
        const editable = isEditingCell(record, 'keywords');
        return editable ? (
          <Form.Item
            name="keywords"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select or type keywords"
              tokenSeparators={[',']}
              autoFocus
              onBlur={() => saveCell(record.key, 'keywords')}
              onPressEnter={() => saveCell(record.key, 'keywords')}
            >
              {keywordList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'keywords')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {keywords?.map(tag => <Tag key={tag} color="green">{tag}</Tag>)}
            </Space>
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
        const editable = isEditingCell(record, 'adjacencyExpansion');
        return editable ? (
          <Form.Item
            name="adjacencyExpansion"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select adjacency"
              autoFocus
              onBlur={() => saveCell(record.key, 'adjacencyExpansion')}
            >
              {adjacencyExpansionList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'adjacencyExpansion')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {adjacency?.map(tag => <Tag key={tag} color="purple">{tag}</Tag>)}
            </Space>
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
        const editable = isEditingCell(record, 'targetIndustry');
        return editable ? (
          <Form.Item
            name="targetIndustry"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select 
              mode="multiple"
              style={{ width: '100%' }} 
              placeholder="Select industries"
              autoFocus
              onBlur={() => saveCell(record.key, 'targetIndustry')}
            >
              {industryOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'targetIndustry')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {Array.isArray(industries) && industries.length > 0 ? industries.map(industry => (
                <Tag key={industry} color="cyan">{industry}</Tag>
              )) : '-'}
            </Space>
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
        const editable = isEditingCell(record, 'functionType');
        return editable ? (
          <Form.Item
            name="functionType"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select 
              mode="multiple"
              style={{ width: '100%' }} 
              placeholder="Select functions"
              autoFocus
              onBlur={() => saveCell(record.key, 'functionType')}
            >
              {functionOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'functionType')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {Array.isArray(functions) && functions.length > 0 ? functions.map(func => (
                <Tag key={func} color="magenta">{func}</Tag>
              )) : '-'}
            </Space>
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
        const editable = isEditingCell(record, 'targetSegment');
        return editable ? (
          <Form.Item
            name="targetSegment"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Select 
              mode="multiple"
              style={{ width: '100%' }} 
              placeholder="Select segments"
              autoFocus
              onBlur={() => saveCell(record.key, 'targetSegment')}
            >
              {targetSegmentOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'targetSegment')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Space wrap>
              {Array.isArray(text) && text.length > 0 ? text.map(segment => (
                <Tag key={segment} color="orange">{segment}</Tag>
              )) : '-'}
            </Space>
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
        const editable = isEditingCell(record, 'offerStatus');
        return editable ? (
          <Form.Item
            name="offerStatus"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <Space>
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                checked={record.offerStatus === 'Active'}
                autoFocus
                onChange={async (checked) => {
                  const newStatus = checked ? 'Active' : 'Inactive';
                  const newData = [...dataSource];
                  const index = newData.findIndex((item) => record.key === item.key);
                  if (index > -1) {
                    newData[index].offerStatus = newStatus;
                    setDataSource(newData);
                    setEditingCell({ key: '', dataIndex: '' });
                  }
                }}
              />
            </Space>
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'offerStatus')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            <Tag color={text === 'Active' ? 'green' : 'red'}>{text || 'Unknown'}</Tag>
          </div>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      render: (text, record) => {
        const editable = isEditingCell(record, 'description');
        return editable ? (
          <Form.Item
            name="description"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <TextArea 
              rows={2} 
              placeholder="Enter description"
              autoFocus
              onBlur={() => saveCell(record.key, 'description')}
            />
          </Form.Item>
        ) : (
          <div 
            onClick={() => editCell(record, 'description')} 
            style={{ 
              cursor: isEditMode ? 'pointer' : 'default', 
              minHeight: '32px', 
              padding: '4px',
              backgroundColor: isEditMode ? '#fafafa' : 'transparent'
            }}
          >
            {text || '-'}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete Service"
          description="Are you sure you want to delete this service?"
          onConfirm={() => handleDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
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
            <Popconfirm
              title="Delete Selected Services"
              description={`Are you sure you want to delete ${selectedRowKeys.length} selected service(s)? This action cannot be undone.`}
              onConfirm={handleSelectedDelete}
              okText="Yes"
              cancelText="No"
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ width: '100%' }}
                disabled={selectedRowKeys.length === 0}
              >
                Delete ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
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
            <Popconfirm
              title="Delete Selected Services"
              description={`Are you sure you want to delete ${selectedRowKeys.length} selected service(s)? This action cannot be undone.`}
              onConfirm={handleSelectedDelete}
              okText="Yes"
              cancelText="No"
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                Delete ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
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
          <Button type="primary" onClick={handleSubmit} size="large" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsForm;
