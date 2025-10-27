import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Space, Form, Modal, Switch, message, Card, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined, SearchOutlined, CloseOutlined, SaveOutlined as SaveIcon, BankOutlined, GlobalOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import '../ResultsPage.css';
import '../ResultsPage-tabs.css';
import logo from '../../assets/Amplify-Value-as-subtitle-3.png';

const { TextArea } = Input;
const { Option } = Select;

const ServiceManagerTab = () => {
  // Data state
  const [dataSource, setDataSource] = useState([]);

  // Form and modal states
  const [form] = Form.useForm();
  const [editingCell, setEditingCell] = useState({ key: '', dataIndex: '' });
  const [searchText, setSearchText] = useState('');
  const isEditMode = true; // Always in view mode for Service Manager tab

  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    today: false,
    yesterday: false,
    previous: false,
    bankOfAmerica: false,
    cisco: false,
    aig: false
  });
  const [activeSidebarOption, setActiveSidebarOption] = useState('Service Manager');
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isServiceManagerModalVisible, setIsServiceManagerModalVisible] = useState(false);
  const [isOrganizationModalVisible, setIsOrganizationModalVisible] = useState(false);
  const [conversations] = useState([]);
  const [userProfile] = useState({
    name: "John Doe",
    email: "john.doe@company.com",
    avatar: null,
    plan: "Free Plan"
  });

  // Options data
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

  // Responsive design is now handled by react-responsive

  useEffect(() => {
    // Load saved services
    const savedData = sessionStorage.getItem('formFlowData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.serviceDetails && parsed.serviceDetails.services) {
        setDataSource(parsed.serviceDetails.services);
      }
    }
  }, []);

  // Sidebar functions
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleNewChat = () => {
    console.log('New chat clicked');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  // Table functions
  const isEditingCell = (record, dataIndex) => 
    isEditMode && editingCell.key === record.key && editingCell.dataIndex === dataIndex;

  const editCell = (record, dataIndex) => {
    if (!isEditMode) return;
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
        saveToStorage(newData);
        setEditingCell({ key: '', dataIndex: '' });
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const saveToStorage = (data) => {
    const formData = JSON.parse(sessionStorage.getItem('formFlowData') || '{}');
    formData.serviceDetails = { services: data };
    sessionStorage.setItem('formFlowData', JSON.stringify(formData));
  };

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
      sorter: (a, b) => {
        const aStr = a.interests?.join(', ') || '';
        const bStr = b.interests?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: interestList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.interests?.includes(value),
      render: (interests, record) => {
        const editable = isEditingCell(record, 'interests');
        return editable ? (
          <Form.Item name="interests" style={{ margin: 0 }}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select offerings"
              tokenSeparators={[',']}
              autoFocus
              onBlur={() => saveCell(record.key, 'interests')}
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
      sorter: (a, b) => {
        const aStr = a.keywords?.join(', ') || '';
        const bStr = b.keywords?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: keywordList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.keywords?.includes(value),
      render: (keywords, record) => {
        const editable = isEditingCell(record, 'keywords');
        return editable ? (
          <Form.Item name="keywords" style={{ margin: 0 }}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Select keywords"
              tokenSeparators={[',']}
              autoFocus
              onBlur={() => saveCell(record.key, 'keywords')}
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
      sorter: (a, b) => {
        const aStr = a.adjacencyExpansion?.join(', ') || '';
        const bStr = b.adjacencyExpansion?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: adjacencyExpansionList.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.adjacencyExpansion?.includes(value),
      render: (adjacency, record) => {
        const editable = isEditingCell(record, 'adjacencyExpansion');
        return editable ? (
          <Form.Item name="adjacencyExpansion" style={{ margin: 0 }}>
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
      sorter: (a, b) => {
        const aStr = a.targetIndustry?.join(', ') || '';
        const bStr = b.targetIndustry?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: industryOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetIndustry?.includes(value),
      render: (industries, record) => {
        const editable = isEditingCell(record, 'targetIndustry');
        return editable ? (
          <Form.Item name="targetIndustry" style={{ margin: 0 }}>
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
      sorter: (a, b) => {
        const aStr = a.functionType?.join(', ') || '';
        const bStr = b.functionType?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: functionOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.functionType?.includes(value),
      render: (functions, record) => {
        const editable = isEditingCell(record, 'functionType');
        return editable ? (
          <Form.Item name="functionType" style={{ margin: 0 }}>
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
      sorter: (a, b) => {
        const aStr = a.targetSegment?.join(', ') || '';
        const bStr = b.targetSegment?.join(', ') || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: targetSegmentOptions.map(item => ({ text: item, value: item })),
      onFilter: (value, record) => record.targetSegment?.includes(value),
      render: (text, record) => {
        const editable = isEditingCell(record, 'targetSegment');
        return editable ? (
          <Form.Item name="targetSegment" style={{ margin: 0 }}>
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
      sorter: (a, b) => {
        const aStr = a.offerStatus || '';
        const bStr = b.offerStatus || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' }
      ],
      onFilter: (value, record) => record.offerStatus === value,
      render: (text, record) => {
        const editable = isEditingCell(record, 'offerStatus');
        return editable ? (
          <Form.Item name="offerStatus" style={{ margin: 0 }}>
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive"
              checked={record.offerStatus === 'Active'}
              autoFocus
              onChange={(checked) => {
                const newStatus = checked ? 'Active' : 'Inactive';
                const newData = [...dataSource];
                const index = newData.findIndex((item) => record.key === item.key);
                if (index > -1) {
                  newData[index].offerStatus = newStatus;
                  setDataSource(newData);
                  saveToStorage(newData);
                  setEditingCell({ key: '', dataIndex: '' });
                }
              }}
            />
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
      sorter: (a, b) => {
        const aStr = a.description || '';
        const bStr = b.description || '';
        return aStr.localeCompare(bStr);
      },
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => {
        const editable = isEditingCell(record, 'description');
        return editable ? (
          <Form.Item name="description" style={{ margin: 0 }}>
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
  ];

  return (
    <div className="results-page">
      {/* Header */}
      <header className="page-header">
        <img src={logo} alt="Logo" className="header-logo" />
        <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Main Container */}
      <div className="page-container" style={{ width: '100%', display: 'flex' }}>
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <button className="collapse-btn-desktop" onClick={toggleSidebarCollapse} aria-label="Toggle sidebar">
            {isSidebarCollapsed ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 4L13 10L7 16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 4L7 10L13 16" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="sidebar-inner">
            <div className="sidebar-top">
              <img src={logo} alt="Logo" className="sidebar-logo" />
              <div className="sidebar-icon-collapsed">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="2" width="28" height="28" rx="4" fill="#201F47" />
                  <text x="16" y="20" fontSize="16" fill="white" fontWeight="bold" textAnchor="middle">V</text>
                </svg>
              </div>
              <button className="close-btn" onClick={closeSidebar} aria-label="Close sidebar">×</button>
            </div>

            <button className="new-chat" onClick={handleNewChat}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              New chat
            </button>

            <nav className="sidebar-nav">
              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('today')}>
                  <span>Today</span>
                  <svg
                    className={`chevron ${expandedSections.today ? 'expanded' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.today ? 'expanded' : ''}`}>
                  {/* Bank of America Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={(e) => {
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('Bank of America');
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('bankOfAmerica');
                    }}>
                      <span style={{ cursor: 'pointer' }}>Bank of America</span>
                      <svg
                        className={`chevron ${expandedSections.bankOfAmerica ? 'expanded' : ''}`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.bankOfAmerica ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
                    </div>
                  </div>

                  {/* Cisco Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={(e) => {
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('Cisco');
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('cisco');
                    }}>
                      <span style={{ cursor: 'pointer' }}>Cisco</span>
                      <svg
                        className={`chevron ${expandedSections.cisco ? 'expanded' : ''}`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.cisco ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
                    </div>
                  </div>

                  {/* AIG Dropdown */}
                  <div className="nav-subsection">
                    <div className="nav-subtitle" onClick={(e) => {
                      if (!e.target.closest('svg')) {
                        setActiveSidebarOption('AIG');
                        if (isMobile) {
                          closeSidebar();
                        }
                      }
                      toggleSection('aig');
                    }}>
                      <span style={{ cursor: 'pointer' }}>AIG</span>
                      <svg
                        className={`chevron ${expandedSections.aig ? 'expanded' : ''}`}
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={`nav-subitems ${expandedSections.aig ? 'expanded' : ''}`}>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Insights' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Insights'); if (isMobile) closeSidebar(); }}>Insights</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Account Playbook' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Account Playbook'); if (isMobile) closeSidebar(); }}>Account Playbook</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Meet Coach' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Meet Coach'); if (isMobile) closeSidebar(); }}>Meet Coach</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Churn Prediction' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Churn Prediction'); if (isMobile) closeSidebar(); }}>Churn Prediction</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Revenue Leak' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Revenue Leak'); if (isMobile) closeSidebar(); }}>Revenue Leak</a>
                      <a href="#" className={`nav-item ${activeSidebarOption === 'Notes' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveSidebarOption('Notes'); if (isMobile) closeSidebar(); }}>Notes</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('yesterday')}>
                  <span>Yesterday</span>
                  <svg
                    className={`chevron ${expandedSections.yesterday ? 'expanded' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.yesterday ? 'expanded' : ''}`}>
                  <a href="#" className="nav-item">Lead Generation Strategy</a>
                  <a href="#" className="nav-item">Customer Segmentation</a>
                </div>
              </div>

              <div className="nav-section">
                <div className="nav-title" onClick={() => toggleSection('previous')}>
                  <span>Previous 7 days</span>
                  <svg
                    className={`chevron ${expandedSections.previous ? 'expanded' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={`nav-items ${expandedSections.previous ? 'expanded' : ''}`}>
                  {conversations.length === 0 ? (
                    <div style={{ padding: '8px 12px', color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
                      No conversations yet. Enter a question above.
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <a
                        key={conv.id}
                        href="#"
                        className="nav-item"
                        onClick={(e) => { e.preventDefault(); console.log('Clicked:', conv.title); }}
                      >
                        {conv.title}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </nav>

            <div className="sidebar-bottom">
              <div className="profile-section">
                <button className="profile-btn" onClick={toggleProfileMenu}>
                  <div className="profile-avatar">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" />
                    ) : (
                      <div className="avatar-placeholder">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="profile-info">
                      <div className="profile-name">{userProfile.name}</div>
                      <div className="profile-email">{userProfile.email}</div>
                    </div>
                  )}
                  {!isSidebarCollapsed && (
                    <svg
                      className={`profile-chevron ${showProfileMenu ? 'expanded' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {showProfileMenu && (
                  <div className="profile-menu">
                    <button className="profile-menu-item" onClick={() => { setActiveSidebarOption('Profile'); setShowProfileMenu(false); if (isMobile) closeSidebar(); }}>
                      <div className="profile-menu-header">
                        <div className="profile-menu-avatar">
                          {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" />
                          ) : (
                            <div className="avatar-placeholder">
                              {userProfile.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="profile-menu-info">
                          <div className="profile-menu-name">{userProfile.name}</div>
                          <div className="profile-menu-email">{userProfile.email}</div>
                          <div className="profile-menu-plan">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginRight: '4px' }}>
                              <path d="M8 1L10.5 5.5L15.5 6L12 9.5L13 14.5L8 12L3 14.5L4 9.5L0.5 6L5.5 5.5L8 1Z" fill="currentColor" />
                            </svg>
                            {userProfile.plan}
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="profile-menu-divider"></div>

                    <div className="profile-menu-items">
                      <button className="profile-menu-item" onClick={() => { setIsOrganizationModalVisible(true); setShowProfileMenu(false); if (isMobile) closeSidebar(); }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <path d="M8 6C8.82843 6 9.5 5.32843 9.5 4.5C9.5 3.67157 8.82843 3 8 3C7.17157 3 6.5 3.67157 6.5 4.5C6.5 5.32843 7.17157 6 8 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <path d="M11 13C11 11.3431 9.65685 10 8 10C6.34315 10 5 11.3431 5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Organization Details</span>
                      </button>

                      <button className="profile-menu-item active" onClick={() => { setIsServiceManagerModalVisible(true); setShowProfileMenu(false); if (isMobile) closeSidebar(); }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 3H14V11H2V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <path d="M2 6H14M5 3V6M11 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M4 9H6M4 12H6M8 9H10M8 12H10M12 9H12.01M12 12H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Service Manager</span>
                      </button>

                      <div className="profile-menu-divider"></div>

                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <path d="M8 5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Suggestions</span>
                      </button>

                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          <path d="M12.8 10C12.7277 10.2384 12.7224 10.4932 12.7847 10.7349C12.847 10.9766 12.9743 11.1953 13.1533 11.3667L13.1933 11.4067C13.3351 11.5481 13.4472 11.7166 13.5228 11.9022C13.5984 12.0878 13.6361 12.287 13.6361 12.4883C13.6361 12.6897 13.5984 12.8889 13.5228 13.0745C13.4472 13.2601 13.3351 13.4286 13.1933 13.57C13.0519 13.7118 12.8834 13.8239 12.6978 13.8995C12.5122 13.9751 12.313 14.0128 12.1117 14.0128C11.9103 14.0128 11.7111 13.9751 11.5255 13.8995C11.3399 13.8239 11.1714 13.7118 11.03 13.57L10.99 13.53C10.8186 13.351 10.5999 13.2237 10.3582 13.1614C10.1165 13.0991 9.86173 13.1044 9.62333 13.1767C9.39017 13.2444 9.17989 13.3765 9.01849 13.558C8.85709 13.7395 8.75116 13.9631 8.71333 14.2033V14.3333C8.71333 14.7426 8.55107 15.1353 8.26268 15.4237C7.97429 15.7121 7.5816 15.8743 7.17233 15.8743C6.76307 15.8743 6.37038 15.7121 6.08199 15.4237C5.7936 15.1353 5.63133 14.7426 5.63133 14.3333V14.27C5.58736 14.0223 5.47349 13.7923 5.30278 13.6064C5.13207 13.4205 4.91157 13.2861 4.66667 13.2183C4.42827 13.146 4.17345 13.1513 3.93177 13.2336C3.69009 13.3159 3.47142 13.4705 3.3 13.68L3.26 13.72C3.11857 13.8618 2.95011 13.9739 2.76451 14.0495C2.57891 14.1251 2.37968 14.1628 2.17833 14.1628C1.97699 14.1628 1.77776 14.1251 1.59216 14.0495C1.40656 13.9739 1.2381 13.8618 1.09667 13.72C0.954838 13.5786 0.842753 13.4101 0.767141 13.2245C0.691528 13.0389 0.653809 12.8397 0.653809 12.6383C0.653809 12.437 0.691528 12.2378 0.767141 12.0522C0.842753 11.8666 0.954838 11.6981 1.09667 11.5567L1.13667 11.5167C1.34713 11.3452 1.5017 11.1266 1.58396 10.8849C1.66623 10.6432 1.67151 10.3884 1.59967 10.15C1.532 9.91684 1.39987 9.70656 1.21839 9.54516C1.03691 9.38376 0.813302 9.27783 0.573 9.24V9.2C0.163735 9.2 -0.228955 9.03774 -0.517345 8.74935C-0.805735 8.46096 -0.968 8.06827 -0.968 7.659C-0.968 7.24974 -0.805735 6.85705 -0.517345 6.56866C-0.228955 6.28027 0.163735 6.118 0.573 6.118H0.636333C0.884054 6.07403 1.11402 5.96016 1.29994 5.78945C1.48586 5.61874 1.62024 5.39824 1.688 5.15333C1.76033 4.91493 1.75505 4.66011 1.67279 4.41843C1.59052 4.17676 1.43595 3.95809 1.2265 3.78667L1.18667 3.74667C1.04484 3.60524 0.932753 3.43678 0.857141 3.25118C0.781528 3.06558 0.743809 2.86635 0.743809 2.665C0.743809 2.46366 0.781528 2.26443 0.857141 2.07883C0.932753 1.89323 1.04484 1.72477 1.18667 1.58333C1.3281 1.4415 1.49656 1.32942 1.68216 1.25381C1.86776 1.17819 2.06699 1.14048 2.26833 1.14048C2.46968 1.14048 2.66891 1.17819 2.85451 1.25381C3.04011 1.32942 3.20857 1.4415 3.35 1.58333L3.39 1.62333C3.56142 1.83279 3.78009 1.98736 4.02177 2.06963C4.26345 2.15189 4.51827 2.15717 4.75667 2.08483H4.79667C5.02983 2.0171 5.24011 1.88497 5.40151 1.70349C5.56291 1.52201 5.66884 1.2984 5.70667 1.05817V0.928333C5.70667 0.519068 5.86893 0.126378 6.15732 -0.162011C6.44571 -0.450401 6.8384 -0.612667 7.24767 -0.612667C7.65693 -0.612667 8.04962 -0.450401 8.33801 -0.162011C8.6264 0.126378 8.78867 0.519068 8.78867 0.928333V0.991667C8.8265 1.2319 8.93243 1.45551 9.09383 1.63699C9.25523 1.81847 9.46551 1.9506 9.69867 2.01833C9.93707 2.09067 10.1919 2.08539 10.4336 2.00312C10.6752 1.92086 10.8939 1.76629 11.0653 1.55683L11.1053 1.51683C11.2468 1.375 11.4152 1.26292 11.6008 1.1873C11.7864 1.11169 11.9857 1.07397 12.187 1.07397C12.3883 1.07397 12.5876 1.11169 12.7732 1.1873C12.9588 1.26292 13.1272 1.375 13.2687 1.51683C13.4105 1.65827 13.5226 1.82673 13.5982 2.01233C13.6738 2.19793 13.7115 2.39716 13.7115 2.5985C13.7115 2.79985 13.6738 2.99908 13.5982 3.18468C13.5226 3.37028 13.4105 3.53874 13.2687 3.68017L13.2287 3.72017C13.0192 3.89159 12.8646 4.11026 12.7824 4.35193C12.7001 4.59361 12.6948 4.84843 12.7667 5.08683V5.12683C12.8344 5.35999 12.9665 5.57027 13.148 5.73167C13.3295 5.89307 13.5531 5.999 13.7933 6.03683H13.9233C14.3326 6.03683 14.7253 6.1991 15.0137 6.48749C15.302 6.77588 15.4643 7.16857 15.4643 7.57783C15.4643 7.9871 15.302 8.37979 15.0137 8.66818C14.7253 8.95657 14.3326 9.11883 13.9233 9.11883H13.86C13.6198 9.15666 13.3962 9.26259 13.2147 9.42399C13.0332 9.58539 12.9011 9.79567 12.8333 10.0288V10.0288Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <span>Setting</span>
                      </button>

                      <button className="profile-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <path d="M8 4V8M8 11H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Help</span>
                      </button>

                      <div className="profile-menu-divider"></div>

                      <button className="profile-menu-item upgrade">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 1L10 5.5L15 6L11.5 9.5L12.5 14.5L8 12L3.5 14.5L4.5 9.5L1 6L6 5.5L8 1Z" fill="currentColor" />
                        </svg>
                        <span>Upgrade Plan</span>
                      </button>

                      <div className="profile-menu-divider"></div>

                      <button className="profile-menu-item logout" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 11.3333L14 8L10 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`} style={{ width: '100%', flex: 1 }}>
    <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '0px', 
            paddingBottom: '120px', 
            width: '100%', 
            boxSizing: 'border-box',
            maxWidth: 'none'
          }}>
            {/* Default Content */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '32px', 
              width: '100%', 
              minHeight: '100vh',
              boxSizing: 'border-box'
            }}>
              <div style={{ width: '100%', marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>Welcome to Service Manager</h2>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Click on the profile menu to access Service Manager or Organization Details. The table will show empty when no services are added.</p>
              </div>
            </div>

            {/* Service Manager Modal */}
            <Modal
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Service Manager</span>
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => setIsServiceManagerModalVisible(false)}
                    style={{ border: 'none', boxShadow: 'none' }}
                  />
                </div>
              }
              open={isServiceManagerModalVisible}
              onCancel={() => setIsServiceManagerModalVisible(false)}
              width="90%"
              style={{ maxWidth: '1400px' }}
              footer={null}
              destroyOnClose
            >
              <div style={{ 
                backgroundColor: 'white', 
                padding: '24px', 
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ width: '100%', marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>Manage your service offerings, keywords, and target segments</h3>
                  <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
                    {dataSource.length === 0 ? 'No services added yet. Click "Add New Service" to get started.' : `${dataSource.length} service(s) configured.`}
                  </p>
                </div>

                <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search services..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
            allowClear
          />
        </div>

                <div style={{ width: '100%' }}>
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
          style={{ width: '100%' }}
          filterMultiple={true}
          showSorterTooltip={false}
        />
      </Form>
                </div>


              </div>
            </Modal>

            {/* Organization Details Modal */}
            <Modal
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Organization Details</span>
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />} 
                    onClick={() => setIsOrganizationModalVisible(false)}
                    style={{ border: 'none', boxShadow: 'none' }}
                  />
                </div>
              }
              open={isOrganizationModalVisible}
              onCancel={() => setIsOrganizationModalVisible(false)}
              width="80%"
              style={{ maxWidth: '1200px' }}
              footer={null}
              destroyOnClose
            >
              <OrganizationDetailsContent />
            </Modal>
          </div>
        </main>
      </div>
    </div>
  );
};

// Organization Details Content Component
const OrganizationDetailsContent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Government', 'Energy', 'Telecommunications', 'Transportation',
    'Real Estate', 'Media & Entertainment', 'Agriculture', 'Construction',
    'Automotive', 'Aerospace', 'Pharmaceuticals', 'Banking', 'Insurance',
    'Consulting', 'Legal Services', 'Non-Profit', 'Other'
  ];

  const countriesWithCities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Boston', 'Austin', 'Denver'],
    'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Edinburgh'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'],
    'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Singapore': ['Singapore'],
  };

  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    // Load saved company details
    const savedData = sessionStorage.getItem('formFlowData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.companyDetails) {
        form.setFieldsValue(parsed.companyDetails);
        if (parsed.companyDetails.country) {
          setAvailableCities(countriesWithCities[parsed.companyDetails.country] || []);
        }
      }
    }
  }, [form]);

  const handleCountryChange = (country) => {
    form.setFieldValue('city', undefined);
    setAvailableCities(countriesWithCities[country] || []);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log('Saving organization details:', values);
      
      // Save to session storage
      const formData = JSON.parse(sessionStorage.getItem('formFlowData') || '{}');
      formData.companyDetails = values;
      sessionStorage.setItem('formFlowData', JSON.stringify(formData));
      
      message.success('Organization details saved successfully');
    } catch (error) {
      message.error('Failed to save organization details');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff' }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: '#201F47'
      }}>
        Manage your company information and settings
      </h3>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Company Name"
                name="companyName"
                rules={[{ required: false }]}
              >
                <Input 
                  prefix={<BankOutlined />}
                  placeholder="Enter company name"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Industry"
                name="industry"
                rules={[{ required: false }]}
              >
                <Select 
                  placeholder="Select industry"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {industryOptions.map(industry => (
                    <Option key={industry} value={industry}>{industry}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Website"
                name="website"
                rules={[
                  { required: false },
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input 
                  prefix={<GlobalOutlined />}
                  placeholder="https://example.com"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Number of Employees"
                name="employees"
                rules={[{ required: false }]}
              >
                <Select 
                  placeholder="Select employee count"
                  size="large"
                >
                  <Option value="1-10">1-10</Option>
                  <Option value="11-50">11-50</Option>
                  <Option value="51-200">51-200</Option>
                  <Option value="201-1000">201-1000</Option>
                  <Option value="1000+">1000+</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: false }]}
              >
                <Select 
                  placeholder="Select country"
                  size="large"
                  showSearch
                  onChange={handleCountryChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Object.keys(countriesWithCities).sort().map(country => (
                    <Option key={country} value={country}>{country}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: false }]}
              >
                <Select 
                  placeholder="Select city"
                  size="large"
                  showSearch
                  disabled={availableCities.length === 0}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {availableCities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                label="Company Description"
                name="description"
                rules={[{ required: false }]}
              >
                <TextArea 
                  rows={4}
                  placeholder="Brief description of your company..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveIcon />}
                  size="large"
                >
                  Save Organization Details
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ServiceManagerTab;
