# Microsoft OAuth Setup Guide

This guide will help you set up Microsoft OAuth authentication for your application.

## Prerequisites
- An active Microsoft account
- Access to Azure Portal

## Step-by-Step Setup

### 1. Create Azure AD Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Sign in with your Microsoft account
3. Search for "Azure Active Directory" in the search bar
4. Click on **Azure Active Directory**

### 2. Register Your Application

1. In the left sidebar, click on **App registrations**
2. Click **+ New registration**
3. Fill in the application details:
   - **Name**: Enter your application name (e.g., "Value Aim App")
   - **Supported account types**: Select "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: 
     - Select "Single-page application (SPA)"
     - Enter your redirect URI (e.g., `http://localhost:5173/login` for development)
4. Click **Register**

### 3. Configure Authentication

1. After registration, you'll see your application's overview page
2. Note down the **Application (client) ID** - you'll need this
3. Click on **Authentication** in the left sidebar
4. Under "Implicit grant and hybrid flows", check:
   - ✅ Access tokens (used for implicit flows)
   - ✅ ID tokens (used for implicit and hybrid flows)
5. Under "Supported account types", ensure:
   - Personal Microsoft accounts only OR
   - Accounts in any organizational directory and personal Microsoft accounts
6. Click **Save**

### 4. Configure API Permissions

1. Click on **API permissions** in the left sidebar
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Add the following permissions:
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `email`
   - ✅ `User.Read`
6. Click **Add permissions**
7. Click **Grant admin consent** (if you're an admin)

### 5. Update Your Application Configuration

1. Open `src/config.js` in your project
2. Update the `MICROSOFT_CONFIG` with your credentials:

```javascript
export const MICROSOFT_CONFIG = {
  clientId: 'YOUR_APPLICATION_CLIENT_ID_HERE', // Replace with your Application (client) ID
  redirectUri: window.location.origin + '/login',
  authority: 'https://login.microsoftonline.com/common',
};
```

### 6. Add Additional Redirect URIs (for Production)

When deploying to production:

1. Go back to **Authentication** in Azure Portal
2. Under **Single-page application**, click **Add URI**
3. Add your production URL (e.g., `https://yourdomain.com/login`)
4. Click **Save**

## Testing

1. Start your development server
2. Navigate to the login page
3. Click the "Microsoft" button
4. You should be redirected to Microsoft's login page
5. After successful authentication, you'll be prompted to enter a username
6. Complete the flow and verify the user data is stored correctly

## Troubleshooting

### Error: "AADSTS50011: The reply URL specified in the request does not match"
- **Solution**: Make sure the redirect URI in your Azure app matches exactly with your application's URL

### Error: "AADSTS65001: The user or administrator has not consented"
- **Solution**: Grant admin consent in the API permissions section

### Error: "Invalid client"
- **Solution**: Double-check your Application (client) ID in `config.js`

### No email returned
- **Solution**: Ensure you've added the `email` scope in API permissions and the user has an email address in their Microsoft account

## Security Notes

- Never commit your actual Client ID to public repositories
- Use environment variables for production deployments
- Regularly rotate your credentials
- Monitor the app's usage in Azure Portal

## Additional Resources

- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)

