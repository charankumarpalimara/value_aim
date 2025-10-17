import React, { useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, Popconfirm, Form, Modal, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import './ServiceDetailsForm.css';

const { TextArea } = Input;
const { Option } = Select;

const ServiceDetailsForm = ({ onNext, onBack }) => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      interests: ['Cloud Migration'],
      keywords: ['Cost Savings', 'Agility'],
      adjacencyExpansion: ['Cloud Security', 'FinOps'],
      targetIndustry: [],
      functionType: [],
      targetSegment: ['Small', 'Medium', 'Large', 'Startups'],
      offerStatus: 'Active',
      description: ''
    },
    {
      key: '2',
      interests: ['AI/ML Solutions'],
      keywords: ['Revenue Growth', 'Innovation'],
      adjacencyExpansion: ['AI Ops', 'Intelligent Automation'],
      targetIndustry: [],
      functionType: [],
      targetSegment: [],
      offerStatus: 'Active',
      description: ''
    },
    {
      key: '3',
      interests: ['Cybersecurity Services'],
      keywords: ['Risk Reduction', 'Compliance'],
      adjacencyExpansion: ['Managed Security', 'Zero Trust'],
      targetIndustry: [],
      functionType: [],
      targetSegment: [],
      offerStatus: 'Active',
      description: ''
    },
    {
      key: '4',
      interests: ['Voice AI'],
      keywords: ['Customer Experience', 'Revenue Growth'],
      adjacencyExpansion: ['Conversational Analytics', 'Multilingual Bots'],
      targetIndustry: [],
      functionType: [],
      targetSegment: [],
      offerStatus: 'Active',
      description: ''
    },
    {
      key: '5',
      interests: ['Data Platform'],
      keywords: ['Decision Making', 'Innovation'],
      adjacencyExpansion: ['AI/ML Use Cases', 'Data Governance'],
      targetIndustry: [],
      functionType: [],
      targetSegment: [],
      offerStatus: 'Active',
      description: ''
    }
  ]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');

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

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
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
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleModalCancel = () => {
    addForm.resetFields();
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log('Service Data:', dataSource);
    onNext({ services: dataSource });
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
      editable: true,
      filters: interestList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.interests?.includes(value),
      render: (interests, record) => {
        const editable = isEditing(record);
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
            >
              {interestList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {interests?.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
          </Space>
        );
      },
    },
    {
      title: 'Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 150,
      editable: true,
      filters: keywordList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.keywords?.includes(value),
      render: (keywords, record) => {
        const editable = isEditing(record);
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
            >
              {keywordList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {keywords?.map(tag => <Tag key={tag} color="green">{tag}</Tag>)}
          </Space>
        );
      },
    },
    {
      title: 'Adjacency Expansion',
      dataIndex: 'adjacencyExpansion',
      key: 'adjacencyExpansion',
      width: 150,
      editable: true,
      filters: adjacencyExpansionList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.adjacencyExpansion?.includes(value),
      render: (adjacency, record) => {
        const editable = isEditing(record);
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
            >
              {adjacencyExpansionList.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {adjacency?.map(tag => <Tag key={tag} color="purple">{tag}</Tag>)}
          </Space>
        );
      },
    },
    {
      title: 'Target Industry',
      dataIndex: 'targetIndustry',
      key: 'targetIndustry',
      width: 150,
      editable: true,
      filters: industryOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetIndustry?.includes(value),
      render: (industries, record) => {
        const editable = isEditing(record);
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
            >
              {industryOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {Array.isArray(industries) ? industries.map(industry => (
              <Tag key={industry} color="cyan">{industry}</Tag>
            )) : (industries || '-')}
          </Space>
        );
      },
    },
    {
      title: 'Function',
      dataIndex: 'functionType',
      key: 'functionType',
      width: 150,
      editable: true,
      filters: functionOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.functionType?.includes(value),
      render: (functions, record) => {
        const editable = isEditing(record);
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
            >
              {functionOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {Array.isArray(functions) ? functions.map(func => (
              <Tag key={func} color="magenta">{func}</Tag>
            )) : (functions || '-')}
          </Space>
        );
      },
    },
    {
      title: 'Target Segment(s)',
      dataIndex: 'targetSegment',
      key: 'targetSegment',
      width: 150,
      editable: true,
      filters: targetSegmentOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetSegment?.includes(value),
      render: (text, record) => {
        const editable = isEditing(record);
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
            >
              {targetSegmentOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          <Space wrap>
            {Array.isArray(text) ? text.map(segment => (
              <Tag key={segment} color="orange">{segment}</Tag>
            )) : (text || '-')}
          </Space>
        );
      },
    },
    {
      title: 'Offer Status',
      dataIndex: 'offerStatus',
      key: 'offerStatus',
      width: 120,
      editable: true,
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' }
      ],
      onFilter: (value, record) => record.offerStatus === value,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="offerStatus"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
            valuePropName="checked"
            getValueFromEvent={(checked) => checked ? 'Active' : 'Inactive'}
            getValueProps={(value) => ({ checked: value === 'Active' })}
          >
            <Space>
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive"
                onChange={(checked) => {
                  form.setFieldsValue({ offerStatus: checked ? 'Active' : 'Inactive' });
                }}
              />
            </Space>
          </Form.Item>
        ) : (
          <Tag color={text === 'Active' ? 'green' : 'red'}>{text || 'Unknown'}</Tag>
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      editable: true,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="description"
            style={{ margin: 0 }}
            rules={[{ required: false }]}
          >
            <TextArea rows={2} placeholder="Enter description" />
          </Form.Item>
        ) : (text || '-');
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={() => save(record.key)}
              size="small"
              style={{ padding: 0 }}
            >
              Save
            </Button>
            <Button
              type="link"
              icon={<CloseOutlined />}
              onClick={cancel}
              size="small"
              style={{ padding: 0 }}
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              size="small"
              style={{ padding: 0 }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                size="small"
                style={{ padding: 0 }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="service-details-container">
      <div className="service-details-header">
        <h2>Service Details</h2>
        <p>Manage your service information in the table below</p>
      </div>

      <div className="service-details-actions" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <Input
          placeholder="Search services..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
        >
          Add New Service
        </Button>
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
          rowClassName="editable-row"
          size="middle"
        />
      </Form>

      <Modal
        title="Add New Service"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="interests"
            label="Product/Service Offerings"
            rules={[{ required: true, message: 'Please select or enter offerings' }]}
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

          <Form.Item
            name="adjacencyExpansion"
                    label="Adjacency Expansion"
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

          <Form.Item
            name="functionType"
            label="Function"
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

          <Form.Item
            name="offerStatus"
            label="Offer Status"
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

      <div className="service-details-footer">
        <Button onClick={onBack} size="large">
              Back
            </Button>
        <Button type="primary" onClick={handleSubmit} size="large">
              Continue
            </Button>
      </div>
    </div>
  );
};

export default ServiceDetailsForm;
