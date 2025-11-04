import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, Upload, Divider, Space, Modal } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../config';
import { userAPI } from '../../utils/api';
import './ProfileTab.css';
import { useNavigate } from 'react-router-dom';

const ProfileTab = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // Force refresh to clear cache
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    picture: null,
    plan: 'Free Plan',
    provider: 'email'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [pendingFormValues, setPendingFormValues] = useState(null);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [isPasswordConfirmModalVisible, setIsPasswordConfirmModalVisible] = useState(false);
  const [pendingPasswordValues, setPendingPasswordValues] = useState(null);

  useEffect(() => {
    // Load user data from localStorage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // Construct full name from firstName and lastName if available
      const displayName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.name || 'John Doe';
      
      setUserProfile({
        ...user,
        name: displayName,
        firstName: user.firstName || user.name?.split(' ')[0] || 'John',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || 'Doe'
      });
      
      form.setFieldsValue({
        firstName: user.firstName || user.name?.split(' ')[0] || 'John',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || 'Doe',
        email: user.email
      });
      
      if (user.picture) {
        setImagePreview(user.picture);
      }
    }
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

  const handleFormSubmit = (values) => {
    console.log('Form submitted, showing confirmation modal');
    setPendingFormValues(values);
    setIsConfirmModalVisible(true);
  };

  const handleProfileUpdate = async () => {
    console.log('=== HANDLE PROFILE UPDATE CALLED ===');
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Form values:', pendingFormValues);
    console.log('Form submitted successfully');
    console.log('Current loading state:', loading);
    
    // Prevent multiple submissions
    if (loading) {
      console.log('Already processing, ignoring duplicate submission');
      return;
    }
    
    const values = pendingFormValues;
    setLoading(true);
    console.log('handleProfileUpdate called with values:', values);
    
    try {
      // Try both 'token' and 'authToken' keys
      let token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log('Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        toast.error('Please log in to update profile');
        setLoading(false);
        setIsConfirmModalVisible(false);
        setPendingFormValues(null);
        return;
      }

      // Create FormData like Alantur project
      const formData = new FormData();
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
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
        
        // Construct full name from firstName and lastName
        const displayName = result.data.firstName && result.data.lastName 
          ? `${result.data.firstName} ${result.data.lastName}` 
          : result.data.name || userProfile.name;
        
        const updatedProfile = {
          ...userProfile,
          ...result.data,
          name: displayName
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
        
        // Close confirmation modal
        setIsConfirmModalVisible(false);
        setPendingFormValues(null);
        
        // Show success notification
        console.log('Showing success notification...');
        toast.success('Your profile has been updated successfully!');
        console.log('Success notification called');
      } else {
        console.log('=== BACKEND ERROR ===');
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        
        // Close confirmation modal
        setIsConfirmModalVisible(false);
        setPendingFormValues(null);
        
        const errorData = await response.json();
        console.log('Error data:', errorData);
        toast.error(errorData.message || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      // Close confirmation modal
      setIsConfirmModalVisible(false);
      setPendingFormValues(null);
      
      toast.error('Failed to update profile. Please check your connection and try again.');
      console.error('Profile update error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const handlePasswordFormSubmit = (values) => {
    console.log('Password form submitted, showing confirmation modal');
    setPendingPasswordValues(values);
    setIsPasswordConfirmModalVisible(true);
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to change password');
        setLoading(false);
        setIsPasswordConfirmModalVisible(false);
        setPendingPasswordValues(null);
        return;
      }

      const values = pendingPasswordValues;

      // Use userAPI.changePassword method
      const result = await userAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      if (result.success) {
        toast.success('Your password has been changed successfully!');
        passwordForm.resetFields();
        setIsPasswordConfirmModalVisible(false);
        setPendingPasswordValues(null);
      } else {
        toast.error(result.message || 'Failed to change password. Please try again.');
        setIsPasswordConfirmModalVisible(false);
        setPendingPasswordValues(null);
      }
    } catch (error) {
      // Handle axios error responses
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password. Please check your connection and try again.';
      
      toast.error(errorMessage);
      console.error('Password change error:', error);
      console.error('Error response:', error.response);
      setIsPasswordConfirmModalVisible(false);
      setPendingPasswordValues(null);
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
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Store the file separately and set preview
      setSelectedFile(file);
      setImagePreview(file);
      setHasNewImage(true);
      console.log('✅ Image selected and stored');
      console.log('✅ Image preview set and hasNewImage flag set to true');
      toast.success('Image selected successfully');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setHasNewImage(false);
    toast('Image removed', {
      icon: 'ℹ️',
    });
  };

  return (
    <>
      <Toaster 
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 24,
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
            iconTheme: {
              primary: '#52c41a',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
            },
          },
          error: {
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
        maxWidth: '100%', 
        margin: '0', 
        padding: isMobile ? '16px' : '24px',
        background: '#fff',
        height: '100%',
        overflowY: 'auto'
      }}>
      {/* <h1 style={{ 
        fontSize: isMobile ? '18px' : '18px', 
        fontWeight: '600', 
        marginBottom: '8px',
        color: '#201F47',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        Profile Settings
      </h1>
      <p style={{ 
        color: '#666', 
        marginBottom: isMobile ? '24px' : '32px',
        fontSize: isMobile ? '13px' : '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        Manage your account settings and preferences
      </p> */}

      {/* Profile Information Card */}
      <Card 
        title="Profile Information"
        style={{ marginBottom: '24px' }}
        styles={{ 
          header: {
            background: '#fafafa',
            borderBottom: '1px solid #e8e8e8'
          }
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
                  : (userProfile.picture || null)
              }
              style={{ 
                backgroundColor: '#201F47',
                marginBottom: '12px'
              }}
            >
              {!imagePreview && !userProfile.picture && userProfile.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {/* Debug info */}
            <div style={{ fontSize: '10px', color: '#999', marginBottom: '8px' }}>
              Debug: {imagePreview ? (imagePreview instanceof File ? 'File' : 'URL') : 'None'}
            </div>
            {/* {imagePreview && (
              <div style={{ 
                fontSize: '12px', 
                color: '#52c41a', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                ✓ Image Selected
              </div>
            )} */}
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
              onFinish={handleFormSubmit}
              style={{ maxWidth: isMobile ? '100%' : '500px' }}
            >
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Enter your first name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Enter your last name"
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
          styles={{ 
            header: {
              background: '#fafafa',
              borderBottom: '1px solid #e8e8e8'
            }
          }}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordFormSubmit}
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
        style={{ marginBottom: '24px' }}
        styles={{ 
          header: {
            background: '#fafafa',
            borderBottom: '1px solid #e8e8e8'
          }
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          width: '100%',
          alignItems: isMobile ? 'center' : 'stretch'
        }}>
          <Button 
            type="primary"
            onClick={() => {
              // TODO: Implement plan upgrade
             navigate('/upgrade-plans');
            }}
            style={{ 
              flex: isMobile ? 'none' : 1,
              width: isMobile ? 'auto' : '100%',
              maxWidth: isMobile ? '280px' : 'none',
              height: isMobile ? '48px' : '40px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px'
            }}
            size="large"
          >
            Upgrade to Pro Plan
          </Button>

          <Button 
            danger
            onClick={() => {
              setIsDeleteAccountModalVisible(true);
            }}
            style={{ 
              flex: isMobile ? 'none' : 1,
              width: isMobile ? 'auto' : '100%',
              maxWidth: isMobile ? '280px' : 'none',
              height: isMobile ? '48px' : '40px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px'
            }}
            size="large"
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        title="Save Profile Changes"
        open={isConfirmModalVisible}
        onOk={handleProfileUpdate}
        onCancel={() => {
          setIsConfirmModalVisible(false);
          setPendingFormValues(null);
        }}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <p>Are you sure you want to save these profile changes?</p>
      </Modal>

      {/* Password Change Confirmation Modal */}
      <Modal
        title="Change Password"
        open={isPasswordConfirmModalVisible}
        onOk={handlePasswordChange}
        onCancel={() => {
          setIsPasswordConfirmModalVisible(false);
          setPendingPasswordValues(null);
        }}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ loading: loading }}
        cancelButtonProps={{ disabled: loading }}
      >
        <p>Are you sure you want to change your password?</p>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
          Make sure to remember your new password.
        </p>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        title="Delete Account"
        open={isDeleteAccountModalVisible}
        onOk={() => {
          // TODO: Implement account deletion
          toast.error('Account deletion is not yet implemented');
          setIsDeleteAccountModalVisible(false);
        }}
        onCancel={() => setIsDeleteAccountModalVisible(false)}
        okText="Yes"
        cancelText="No"
        centered
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete your account?</p>
        <p style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '8px' }}>
          This action cannot be undone.
        </p>
      </Modal>
    </div>
    </>
  );
};

export default ProfileTab;

