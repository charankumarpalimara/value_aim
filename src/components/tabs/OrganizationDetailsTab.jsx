import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Card, Row, Col, Modal } from 'antd';
import { SaveOutlined, BankOutlined, GlobalOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';

const { TextArea } = Input;
const { Option } = Select;

const OrganizationDetailsTab = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [_formData, setFormData] = useState(null); // Prefix with _ to indicate intentionally unused
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Government', 'Energy', 'Telecommunications', 'Transportation',
    'Real Estate', 'Media & Entertainment', 'Agriculture', 'Construction',
    'Automotive', 'Aerospace', 'Pharmaceuticals', 'Banking', 'Insurance',
    'Consulting', 'Legal Services', 'Non-Profit', 'Other'
  ];

  const countriesWithCities = useMemo(() => ({
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco', 'Seattle', 'Boston', 'Austin', 'Denver'],
    'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Edinburgh'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'],
    'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Singapore': ['Singapore'],
  }), []);

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

        console.log('Loading organization data, response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('Organization data loaded:', result);
          
          if (result.success && result.data) {
            const companyData = result.data;
            console.log('Setting form fields with:', companyData);
            
            // Parse website URL if it exists - remove protocol and www
            if (companyData.website) {
              companyData.websiteName = companyData.website.replace(/^https?:\/\/(www\.)?/, '');
            }
            
            form.setFieldsValue(companyData);
            setFormData(companyData);
            
            // Set available cities based on country
            if (companyData.country) {
              setAvailableCities(countriesWithCities[companyData.country] || []);
            }
          }
        } else if (response.status === 404) {
          console.log('No organization data found, showing empty form');
        } else {
          const errorData = await response.json();
          console.error('Error loading organization data:', errorData);
        }
      } catch (error) {
        console.error('Error loading organization data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizationData();
  }, [form, countriesWithCities]);

  const handleCountryChange = (country) => {
    form.setFieldValue('city', undefined);
    setAvailableCities(countriesWithCities[country] || []);
  };

  const handleSubmit = async (values) => {
    // Construct full website URL - add https:// if not present
    const websiteName = values.websiteName?.trim();
    if (websiteName) {
      // Check if it already has a protocol
      if (!/^https?:\/\//i.test(websiteName)) {
        values.website = `https://${websiteName}`;
      } else {
        values.website = websiteName;
      }
    }
    
    // Store values and show confirmation modal
    setPendingFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const confirmSave = async () => {
    try {
      console.log('=== Starting confirmSave (Organization Details) ===');
      const values = pendingFormValues;
      console.log('Saving organization details:', values);
      
      // Get auth token
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        toast.error('Please log in to save organization details', {
          duration: 4000,
          position: 'top-center',
        });
        setIsConfirmModalVisible(false);
        return;
      }

      // Set loading state
      setLoading(true);
      setIsConfirmModalVisible(false);

      // Prepare data for backend
      const organizationData = {
        companyName: values.companyName,
        industry: values.industry,
        website: values.website,
        employees: values.employees,
        country: values.country,
        city: values.city
      };
      console.log('Sending to backend:', organizationData);

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(organizationData)
      });
      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        console.log('Organization details saved successfully - showing toast');
        
        // Update form data with saved values
        setFormData(values);
        
        // Reload the data to ensure we have the latest from backend
        const reloadResponse = await fetch(`${API_BASE_URL}/company`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (reloadResponse.ok) {
          const reloadResult = await reloadResponse.json();
          if (reloadResult.success && reloadResult.data) {
            // Parse website URL if it exists - remove protocol and www
            if (reloadResult.data.website) {
              reloadResult.data.websiteName = reloadResult.data.website.replace(/^https?:\/\/(www\.)?/, '');
            }
            form.setFieldsValue(reloadResult.data);
            setFormData(reloadResult.data);
          }
        }
        
        // Show success notification
        toast.success('Organization details saved successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error(errorData.message || 'Failed to save organization details.', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error saving organization details:', error);
      // Only show toast if it's a network error (not a handled error response)
      if (error.message && !error.response) {
        toast.error('Failed to save. Please check your connection and try again.', {
          duration: 4000,
          position: 'top-center',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 24,
          zIndex: 10000,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: 'rgba(0, 0, 0, 0.85)',
            padding: '10px 16px',
            borderRadius: '2px',
            boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: '400px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#52c41a',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ff4d4f',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
            },
          },
        }}
      />
      <div style={{ 
        padding: '24px',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h3 style={{ 
        fontSize: '18px', 
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
        {/* {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div>Loading organization data...</div>
          </div>
        )} */}
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
            rules={[{ required: true, message: 'Please enter company name' }]}
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
            rules={[{ required: true, message: 'Please select industry' }]}
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
            name="websiteName" 
            style={{ 
              flex: isMobile ? 'none' : 1, 
              minWidth: isMobile ? '100%' : '200px',
              width: isMobile ? '100%' : 'auto'
            }}
            rules={[
              { required: true, message: 'Please enter website name' },
              { 
                pattern: /^(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/, 
                message: 'Please enter a valid domain (e.g., example.com or www.example.com)' 
              }
            ]}
          >
            <Input 
              prefix={<GlobalOutlined />}
              placeholder="example.com or www.example.com"
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
            rules={[{ required: true, message: 'Please select number of employees' }]}
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
            rules={[{ required: true, message: 'Please select country' }]}
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
            rules={[{ required: true, message: 'Please select city' }]}
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

        <Form.Item style={{ marginBottom: '20px', marginTop: '25px' }}>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            style={{ 
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? '100%' : '200px',
              // height: isMobile ? '48px' : '30px',
              // height:'48px'
            }}
          >
            {loading ? 'Saving...' : 'Save Organization Details'}
          </Button>
        </Form.Item>
      </Form>

      {/* Dynamic Content Display */}
      {/* {formData && (
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
      )} */}

      {/* Confirmation Modal */}
      <Modal
        title="Save Organization Details"
        open={isConfirmModalVisible}
        onOk={confirmSave}
        onCancel={() => setIsConfirmModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <p>Are you sure you want to save these organization details?</p>
      </Modal>
    </div>
    </>
  );
};

export default OrganizationDetailsTab;

