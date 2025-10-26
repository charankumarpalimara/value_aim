# Apple OAuth Setup Guide

This guide will help you set up Apple Sign In authentication for your application.

## Prerequisites
- An Apple Developer Account (required - $99/year)
- Access to Apple Developer Portal
- A registered domain (required for web Sign in with Apple)

## Important Notes
⚠️ **Apple Sign In for Web requires:**
- A registered domain (cannot use localhost in production)
- HTTPS (SSL certificate required)
- For development, you can test with localhost but need proper configuration

## Step-by-Step Setup

### 1. Create an App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in with your Apple Developer account
3. Click on **Certificates, Identifiers & Profiles**
4. Click on **Identifiers** in the left sidebar
5. Click the **+** button to create a new identifier
6. Select **App IDs** and click **Continue**
7. Select **App** and click **Continue**
8. Fill in the details:
   - **Description**: Enter a description (e.g., "Value Aim App")
   - **Bundle ID**: Enter a unique bundle ID (e.g., `com.yourcompany.valueaim`)
9. Under **Capabilities**, check ✅ **Sign in with Apple**
10. Click **Continue** and then **Register**

### 2. Create a Services ID

1. Go back to **Identifiers**
2. Click the **+** button
3. Select **Services IDs** and click **Continue**
4. Fill in the details:
   - **Description**: Enter a description (e.g., "Value Aim Web App")
   - **Identifier**: Enter a unique identifier (e.g., `com.yourcompany.valueaim.web`)
     - ⚠️ This is your **Client ID** - save it!
5. Click **Continue** and then **Register**

### 3. Configure Sign in with Apple for Web

1. Find your newly created Services ID in the list
2. Click on it to edit
3. Check ✅ **Sign in with Apple**
4. Click **Configure** next to Sign in with Apple
5. In the configuration dialog:
   - **Primary App ID**: Select the App ID you created in Step 1
   - **Web Domain**: Enter your domain (e.g., `yourdomain.com`)
     - For development: You can use `localhost` but it has limitations
   - **Return URLs**: Add your redirect URIs:
     - Development: `http://localhost:5173/login`
     - Production: `https://yourdomain.com/login`
6. Click **Save**
7. Click **Continue** and then **Save**

### 4. Configure Your Domain (For Production)

1. Go to **Certificates, Identifiers & Profiles**
2. Click on **Services** in the left sidebar (under More)
3. Find **Sign in with Apple** and click on it
4. Under **Domains and Subdomains**, click **+** to add your domain
5. Enter your domain (e.g., `yourdomain.com`)
6. Download the verification file
7. Upload the verification file to your domain at:
   ```
   https://yourdomain.com/.well-known/apple-developer-domain-association.txt
   ```
8. Click **Verify**

### 5. Update Your Application Configuration

1. Open `src/config.js` in your project
2. Update the `APPLE_CONFIG` with your credentials:

```javascript
export const APPLE_CONFIG = {
  clientId: 'com.yourcompany.valueaim.web', // Your Services ID
  redirectUri: window.location.origin + '/login',
  scope: 'name email',
  usePopup: true,
};
```

### 6. Test the Integration

#### For Development (Localhost)

1. Start your development server
2. Navigate to the login page
3. Click the "Apple" button
4. You should see the Apple Sign In popup
5. Sign in with your Apple ID
6. Complete the username prompt

#### For Production

1. Deploy your application to your domain
2. Ensure HTTPS is configured
3. Ensure the domain verification file is accessible
4. Test the Apple Sign In flow

## How Apple Sign In Works

1. User clicks "Sign in with Apple"
2. Apple authentication popup opens
3. User signs in with their Apple ID
4. On first sign-in:
   - Apple asks for permission to share email/name
   - User can choose to hide their email (Apple provides a relay email)
5. Apple returns an ID token with user information
6. Your app receives:
   - Email (real or relay)
   - Name (only on first sign-in)
   - User identifier
7. User is prompted to enter/confirm username
8. User data is stored and user proceeds to app

## Privacy Features

Apple's Sign In includes unique privacy features:

- **Hide My Email**: Users can choose to hide their real email address
  - Apple provides a relay email like `abc123@privaterelay.appleid.com`
  - Emails sent to this address are forwarded to the user's real email
- **Name Sharing**: Names are only provided on first sign-in
- **Account Management**: Users can manage app access in their Apple ID settings

## Troubleshooting

### Error: "invalid_client"
- **Solution**: Double-check your Services ID (Client ID) in `config.js`

### Error: "invalid_request" or redirect_uri mismatch
- **Solution**: Ensure your redirect URI exactly matches what's configured in Apple Developer Portal

### Domain verification fails
- **Solution**: 
  - Ensure the verification file is accessible via HTTPS
  - Check the file is at the exact path: `/.well-known/apple-developer-domain-association.txt`
  - No redirect or authentication should be required to access this file

### Apple Sign In button doesn't appear
- **Solution**: Check browser console for errors, ensure the Apple JS SDK is loading correctly

### Name is not returned after first sign-in
- **Solution**: This is expected behavior. Apple only provides the name on first sign-in. Store it when you receive it.

### Works on desktop but not mobile
- **Solution**: Ensure your redirect URIs work on mobile browsers and are properly configured

## Development vs Production

### Development (Localhost)
- ✅ Can use `http://localhost`
- ✅ No domain verification needed
- ❌ Limited features
- ❌ May have CORS issues

### Production
- ✅ Must use HTTPS
- ✅ Requires domain verification
- ✅ Full features available
- ✅ Better user experience

## Security Best Practices

1. **Never expose sensitive credentials**: Don't commit actual Client IDs to public repos
2. **Use environment variables**: For production deployments
3. **Validate tokens**: Always validate the ID token on your backend
4. **Handle relay emails**: Be prepared to handle Apple's relay email addresses
5. **Store user data securely**: Use proper encryption for sensitive user information
6. **Respect privacy**: Follow Apple's guidelines for handling user data

## Backend Validation (Recommended)

For production apps, validate the Apple ID token on your backend:

```javascript
// Example: Validate Apple ID token
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

jwt.verify(idToken, getKey, {
  issuer: 'https://appleid.apple.com',
  audience: 'your.client.id'
}, (err, decoded) => {
  if (err) {
    console.error('Token validation failed:', err);
  } else {
    console.log('Valid token:', decoded);
  }
});
```

## Testing Accounts

- Use your personal Apple ID for testing
- Create test Apple IDs if needed
- Test both scenarios:
  1. First-time sign-in (provides name)
  2. Returning user sign-in (no name)

## Additional Resources

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Sign in with Apple JS Documentation](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)
- [Apple Developer Forums](https://developer.apple.com/forums/)

## Cost

- Apple Developer Program: **$99/year** (required)
- No additional costs for using Sign in with Apple

## Support

If you encounter issues:
1. Check Apple Developer Forums
2. Review Apple's technical documentation
3. Contact Apple Developer Support (available with paid membership)

