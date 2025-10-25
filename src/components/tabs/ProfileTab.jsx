import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, Upload, message, Divider, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { API_BASE_URL } from '../../config';
import './ProfileTab.css';

const ProfileTab = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // Force refresh to clear cache
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    picture: null,
    plan: 'Free Plan',
    provider: 'email'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Load user data from backend API
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          console.log('No token found');
          return;
        }

        console.log('Loading user profile from backend...');
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('User profile loaded from backend:', result);
          
          if (result.success && result.data) {
            console.log('=== SETTING USER PROFILE ===');
            console.log('Full result.data:', result.data);
            console.log('result.data.picture:', result.data.picture);
            console.log('result.data type:', typeof result.data);
            
            setUserProfile(result.data);
            form.setFieldsValue({
              name: result.data.name,
              email: result.data.email
            });
            
            // Set image preview with the picture URL from backend
            if (result.data.picture) {
              console.log('Setting image preview to:', result.data.picture);
              setImagePreview(result.data.picture);
            } else {
              console.log('No picture URL in result.data');
            }
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(result.data));
          }
        } else {
          console.error('Failed to load user profile');
          // Fallback to localStorage if API fails
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserProfile(user);
            form.setFieldsValue({
              name: user.name,
              email: user.email
            });
            if (user.picture) {
              setImagePreview(user.picture);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserProfile(user);
          form.setFieldsValue({
            name: user.name,
            email: user.email
          });
          if (user.picture) {
            setImagePreview(user.picture);
          }
        }
      }
    };

    loadUserProfile();
  }, [form]);

  // Debug effect to monitor imagePreview changes
  useEffect(() => {
    console.log('ImagePreview changed:', imagePreview);
    if (imagePreview instanceof File) {
      console.log('ImagePreview is a File, URL:', URL.createObjectURL(imagePreview));
    } else if (imagePreview) {
      console.log('ImagePreview is a URL:', imagePreview);
    }
  }, [imagePreview]);

  // Debug effect to monitor userProfile changes
  useEffect(() => {
    console.log('=== USERPROFILE CHANGED ===');
    console.log('userProfile:', userProfile);
    console.log('userProfile.picture:', userProfile.picture);
  }, [userProfile]);

  const handleProfileUpdate = async (values) => {
    console.log('=== HANDLE PROFILE UPDATE CALLED ===');
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form values:', values);
    console.log('Form submitted successfully');
    console.log('Current loading state:', loading);
    
    // Prevent multiple submissions
    if (loading) {
      console.log('Already processing, ignoring duplicate submission');
      return;
    }
    
    setLoading(true);
    console.log('handleProfileUpdate called with values:', values);
    
    try {
      // Try both 'token' and 'authToken' keys
      let token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        message.error('Please log in to update profile');
        setLoading(false);
        return;
      }

      // Create FormData like Alantur project
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      
      // Debug current state
      console.log('=== SAVE CHANGES DEBUG ===');
      console.log('hasNewImage:', hasNewImage);
      console.log('imagePreview:', imagePreview);
      console.log('imagePreview instanceof File:', imagePreview instanceof File);
      console.log('userProfile.picture:', userProfile.picture);
      
      // Add image if selected (following Alantur pattern)
      // Use selectedFile instead of imagePreview to ensure we have the actual File object
      if (hasNewImage && selectedFile) {
        console.log('✅ Adding image to FormData');
        console.log('Selected file details:', {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size
        });
        
        // Use the original file directly
        formData.append('profileImage', selectedFile, selectedFile.name);
        console.log('Added image to FormData with name:', selectedFile.name);
        
        // Debug FormData contents
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`${key}:`, value);
          }
        }
      } else {
        console.log('❌ Not adding image to FormData');
        console.log('hasNewImage:', hasNewImage);
        console.log('selectedFile:', selectedFile);
        console.log('imagePreview instanceof File:', imagePreview instanceof File);
      }

      console.log('=== SENDING REQUEST TO BACKEND ===');
      console.log('Request URL:', `${API_BASE_URL}/user/profile`);
      console.log('Request method:', 'PUT');
      console.log('FormData size:', formData.get('profileImage') ? 'Image included' : 'No image');
      
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('=== BACKEND RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        console.log('Picture from backend:', result.data.picture);
        
        const updatedProfile = {
          ...userProfile,
          ...result.data
        };
        
        setUserProfile(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
        
        // Update image preview with the new image URL from backend
        if (result.data.picture) {
          setImagePreview(result.data.picture);
          console.log('Updated imagePreview to:', result.data.picture);
        }
        
        // Reset the new image flag
        setHasNewImage(false);
        setSelectedFile(null);
        
        message.success('Profile updated successfully');
      } else {
        console.log('=== BACKEND ERROR ===');
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        
        const errorData = await response.json();
        console.log('Error data:', errorData);
        message.error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
      console.error('Profile update error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        message.error('Please log in to change password');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      });

      if (response.ok) {
        message.success('Password changed successfully');
        passwordForm.resetFields();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      message.error('Failed to change password');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };


  // Handle image selection like Alantur project
  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('=== IMAGE SELECTION DEBUG ===');
      console.log('File selected:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Image size must be less than 5MB');
        return;
      }
      
      // Store the file separately and set preview
      setSelectedFile(file);
      setImagePreview(file);
      setHasNewImage(true);
      console.log('✅ Image selected and stored');
      console.log('✅ Image preview set and hasNewImage flag set to true');
      message.success('Image selected successfully');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setHasNewImage(false);
    message.info('Image removed');
  };

  return (
    <div style={{ 
      maxWidth: '100%', 
      margin: '0', 
      padding: isMobile ? '16px' : '24px',
      background: '#fff',
      minHeight: 'auto',
      overflow: 'auto'
    }}>
      <h1 style={{ 
        fontSize: isMobile ? '24px' : '28px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: '#201F47'
      }}>
        Profile Settings
      </h1>
      <p style={{ 
        color: '#666', 
        marginBottom: isMobile ? '24px' : '32px',
        fontSize: isMobile ? '13px' : '14px'
      }}>
        Manage your account settings and preferences
      </p>

      {/* Profile Information Card */}
      <Card 
        title="Profile Information"
        style={{ marginBottom: '24px' }}
        headStyle={{ 
          background: '#fafafa',
          borderBottom: '1px solid #e8e8e8'
        }}
      >
        <div className="profile-content-wrapper">
          <div className="profile-avatar-section">
            <Avatar 
              size={100} 
              icon={<UserOutlined />}
              src={
                imagePreview 
                  ? (imagePreview instanceof File ? URL.createObjectURL(imagePreview) : imagePreview)
                  : (userProfile.picture || userProfile.avatar || null)
              }
              style={{ 
                backgroundColor: '#201F47',
                marginBottom: '12px'
              }}
              onError={(e) => {
                console.error('Avatar image failed to load:', e.target.src);
                console.error('Trying fallback to userProfile.avatar:', userProfile.avatar);
                // Try to use avatar field if picture fails
                if (userProfile.avatar && e.target.src !== userProfile.avatar) {
                  e.target.src = userProfile.avatar;
                }
              }}
            >
              {!imagePreview && !userProfile.picture && !userProfile.avatar && userProfile.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {/* Debug info */}
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px' }}>
              Debug: imagePreview={imagePreview ? 'Yes' : 'No'}, picture={userProfile.picture || 'None'}, avatar={userProfile.avatar || 'None'}
            </div>
            {/* Debug picture URL */}
            {userProfile.picture && (
              <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px', wordBreak: 'break-all' }}>
                Picture URL: {userProfile.picture}
              </div>
            )}
            {userProfile.avatar && userProfile.avatar !== userProfile.picture && (
              <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px', wordBreak: 'break-all' }}>
                Avatar URL: {userProfile.avatar}
              </div>
            )}
            {/* Test image loading */}
            <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Test Image Load:</div>
              {userProfile.picture && (
                <img 
                  src={userProfile.picture} 
                  alt="test" 
                  style={{ maxWidth: '50px', maxHeight: '50px', border: '1px solid #ccc' }}
                  onLoad={() => console.log('✅ Image loaded successfully:', userProfile.picture)}
                  onError={() => console.error('❌ Image failed to load:', userProfile.picture)}
                />
              )}
              {!userProfile.picture && userProfile.avatar && (
                <img 
                  src={userProfile.avatar} 
                  alt="test" 
                  style={{ maxWidth: '50px', maxHeight: '50px', border: '1px solid #ccc' }}
                  onLoad={() => console.log('✅ Avatar image loaded successfully:', userProfile.avatar)}
                  onError={() => console.error('❌ Avatar image failed to load:', userProfile.avatar)}
                />
              )}
            </div>
            {imagePreview && (
              <div style={{ 
                fontSize: '12px', 
                color: '#52c41a', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                ✓ Image Selected
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <input
                type="file"
                onChange={handleImageSelection}
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-image-input"
              />
              <Button 
                icon={<UploadOutlined />} 
                size="small"
                onClick={() => document.getElementById('profile-image-input').click()}
              >
                Upload Photo
              </Button>
              {imagePreview && (
                <Button 
                  size="small" 
                  danger 
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="profile-form-section">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileUpdate}
              style={{ maxWidth: isMobile ? '100%' : '500px' }}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Enter your full name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="your.email@example.com"
                  size="large"
                  disabled={userProfile.provider !== 'email'}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                  style={{ 
                    width: isMobile ? '100%' : 'auto',
                    // ':hover': {
                    //   backgroundColor: '#1890ff !important',
                    //   borderColor: '#1890ff !important'
                    // }
                  }}
                  className="no-hover-effect"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <Divider />

        <div style={{ 
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <Space direction="vertical" size="small">
            <div>
              <strong>Account Type:</strong> {userProfile.provider === 'email' ? 'Email/Password' : 'OAuth (' + userProfile.provider + ')'}
            </div>
            <div>
              <strong>Current Plan:</strong> {userProfile.plan}
            </div>
            <div>
              <strong>Member Since:</strong> {new Date().toLocaleDateString()}
            </div>
          </Space>
        </div>
      </Card>

      {/* Password Change Card - Only for email users */}
      {userProfile.provider === 'email' && (
        <Card 
          title="Change Password"
          style={{ marginBottom: '24px' }}
          headStyle={{ 
            background: '#fafafa',
            borderBottom: '1px solid #e8e8e8'
          }}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
            style={{ maxWidth: isMobile ? '100%' : '500px' }}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Enter current password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter your new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Account Actions */}
      <Card 
        title="Account Actions"
        headStyle={{ 
          background: '#fafafa',
          borderBottom: '1px solid #e8e8e8'
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div className="action-item">
            <Button 
              type="default"
              size="large"
              style={{ width: isMobile ? '100%' : 'auto' }}
              onClick={() => {
                // TODO: Implement plan upgrade
                message.info('Plan upgrade coming soon!');
              }}
            >
              Upgrade to Pro Plan
            </Button>
            <div className="action-description">
              Get access to advanced features and unlimited usage
            </div>
          </div>

          <Divider style={{ margin: '12px 0' }} />

          <div className="action-item">
            <Button 
              danger
              size="large"
              style={{ width: isMobile ? '100%' : 'auto' }}
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // TODO: Implement account deletion
                  message.error('Account deletion is not yet implemented');
                }
              }}
            >
              Delete Account
            </Button>
            <div className="action-description danger">
              Permanently delete your account and all associated data
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ProfileTab;

