import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message, Row, Col } from 'antd';
import { SaveOutlined, BankOutlined, GlobalOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { API_BASE_URL } from '../../config';

const { TextArea } = Input;
const { Option } = Select;

const OrganizationDetailsTab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

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

  // Load existing organization data
  useEffect(() => {
    const loadOrganizationData = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) return;

        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/company`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.company) {
            form.setFieldsValue(result.company);
            setFormData(result.company);
            if (result.company.country) {
              handleCountryChange(result.company.country);
            }
          }
        }
      } catch (error) {
        console.error('Error loading organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationData();
  }, [form]);

  const handleCountryChange = (country) => {
    form.setFieldValue('city', undefined);
    setAvailableCities(countriesWithCities[country] || []);
  };

  const handleSubmit = async (values) => {
    try {
      console.log('Saving organization details:', values);
      
      // Get auth token
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        message.error('Please log in to save organization details');
        return;
      }

      // Prepare data for backend
      const organizationData = {
        companyName: values.companyName,
        industry: values.industry,
        website: values.website,
        employees: values.employees,
        country: values.country,
        city: values.city
      };

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(organizationData)
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(values);
        message.success('Organization details saved successfully');
        console.log('Backend response:', result);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to save organization details');
      }
    } catch (error) {
      console.error('Error saving organization details:', error);
      message.error('Failed to save organization details. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '24px',
        color: '#201F47'
      }}>
        Manage your company information and settings
      </h3>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div>Loading organization data...</div>
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '16px', 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Form.Item 
            label="Company Name" 
            name="companyName" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <Input 
              prefix={<BankOutlined />}
              placeholder="Enter company name"
              size="large"
            />
          </Form.Item>
          <Form.Item 
            label="Industry" 
            name="industry" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
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
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '16px', 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Form.Item 
            label="Website" 
            name="website" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
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
          <Form.Item 
            label="Number of Employees" 
            name="employees" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
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
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '16px', 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Form.Item 
            label="Country" 
            name="country" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
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
          <Form.Item 
            label="City" 
            name="city" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
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
        </div>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            style={{ width: isMobile ? '100%' : 'auto' }}
          >
            {loading ? 'Saving...' : 'Save Organization Details'}
          </Button>
        </Form.Item>
      </Form>

      {/* Dynamic Content Display */}
      {formData && (
        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ 
            marginBottom: '16px', 
            color: '#201F47', 
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Organization Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {formData.companyName && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>Company:</span>
                <span style={{ color: '#1890ff' }}>{formData.companyName}</span>
              </div>
            )}
            {formData.industry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>Industry:</span>
                <span style={{ color: '#52c41a' }}>{formData.industry}</span>
              </div>
            )}
            {formData.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>Website:</span>
                <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1890ff' }}>
                  {formData.website}
                </a>
              </div>
            )}
            {formData.employees && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>Employees:</span>
                <span style={{ color: '#722ed1' }}>{formData.employees}</span>
              </div>
            )}
            {formData.country && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>Country:</span>
                <span style={{ color: '#fa8c16' }}>{formData.country}</span>
              </div>
            )}
            {formData.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '500', minWidth: '120px' }}>City:</span>
                <span style={{ color: '#13c2c2' }}>{formData.city}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationDetailsTab;

