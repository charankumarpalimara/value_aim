# OAuth Authentication Setup Guide

This application supports multiple OAuth providers for user authentication. This guide provides an overview and links to detailed setup instructions for each provider.

## Supported OAuth Providers

- ✅ **Google** - Fully configured
- 🔧 **Microsoft** - Ready to configure
- 🔧 **Apple** - Ready to configure
- 🚧 **Phone** - Coming soon

## Quick Start

### 1. Choose Your OAuth Provider(s)

You can enable one or all of the OAuth providers. Each requires separate configuration in their respective developer portals.

### 2. Configure Each Provider

Follow the detailed setup guides:

| Provider | Setup Guide | Difficulty | Cost |
|----------|------------|------------|------|
| Google | [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) | Easy | Free |
| Microsoft | [MICROSOFT_OAUTH_SETUP.md](./MICROSOFT_OAUTH_SETUP.md) | Medium | Free |
| Apple | [APPLE_OAUTH_SETUP.md](./APPLE_OAUTH_SETUP.md) | Hard | $99/year |

### 3. Update Configuration

After obtaining your OAuth credentials, update `src/config.js`:

```javascript
// Google OAuth
export const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// Microsoft OAuth
export const MICROSOFT_CONFIG = {
  clientId: 'YOUR_MICROSOFT_CLIENT_ID',
  redirectUri: window.location.origin + '/login',
  authority: 'https://login.microsoftonline.com/common',
};

// Apple OAuth
export const APPLE_CONFIG = {
  clientId: 'YOUR_APPLE_CLIENT_ID',
  redirectUri: window.location.origin + '/login',
  scope: 'name email',
  usePopup: true,
};
```

## How OAuth Flow Works

### User Experience

1. User clicks on an OAuth provider button (Google, Microsoft, or Apple)
2. Authentication popup/redirect opens
3. User signs in with their provider account
4. User is prompted to enter/confirm a username
5. User data is stored and they proceed to the application

### Technical Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ 1. Click Login Button
       ▼
┌─────────────────────┐
│   Login Page        │
│  (LoginPage.jsx)    │
└──────┬──────────────┘
       │ 2. Initiate OAuth
       ▼
┌─────────────────────┐
│  OAuth Provider     │
│  (Google/MS/Apple)  │
└──────┬──────────────┘
       │ 3. User Authenticates
       ▼
┌─────────────────────┐
│  Redirect to App    │
│  with Access Token  │
└──────┬──────────────┘
       │ 4. Fetch User Info
       ▼
┌─────────────────────┐
│  Username Prompt    │
│  Modal              │
└──────┬──────────────┘
       │ 5. Submit Username
       ▼
┌─────────────────────┐
│  Store User Data    │
│  (localStorage)     │
└──────┬──────────────┘
       │ 6. Navigate to App
       ▼
┌─────────────────────┐
│  Company Details    │
│  Page               │
└─────────────────────┘
```

## Username Prompt Feature

After successful OAuth authentication, users are presented with a username prompt:

### Why Username Prompt?

- Allows users to choose their display name
- Pre-filled with OAuth provider name (editable)
- Provides consistent user experience across all OAuth providers
- Separates authentication identity from display identity

### What Data is Stored?

```javascript
{
  name: "User's chosen username",
  email: "user@example.com",
  avatar: "https://profile-picture-url.com/image.jpg", // if available
  provider: "google" | "microsoft" | "apple",
  plan: "Free Plan"
}
```

## Provider-Specific Features

### Google
- ✅ Profile picture available
- ✅ Email always provided
- ✅ Name always provided
- ✅ Easy to set up
- ✅ Works on all platforms

### Microsoft
- ⚠️ No profile picture in basic scope
- ✅ Email always provided
- ✅ Name always provided
- ✅ Enterprise-friendly
- ✅ Azure AD integration

### Apple
- ⚠️ No profile picture provided
- ✅ Email provided (may be relay email)
- ⚠️ Name only on first sign-in
- ✅ Strong privacy features
- ⚠️ Requires paid Apple Developer account
- ⚠️ Requires domain verification

## Development vs Production

### Development Environment

| Feature | Google | Microsoft | Apple |
|---------|--------|-----------|-------|
| Localhost Support | ✅ Yes | ✅ Yes | ⚠️ Limited |
| HTTPS Required | ❌ No | ❌ No | ⚠️ Recommended |
| Domain Verification | ❌ No | ❌ No | ❌ No |

### Production Environment

| Feature | Google | Microsoft | Apple |
|---------|--------|-----------|-------|
| HTTPS Required | ✅ Yes | ✅ Yes | ✅ Yes |
| Domain Verification | ⚠️ Optional | ❌ No | ✅ Required |
| Additional Setup | ❌ No | ❌ No | ✅ Yes |

## Testing Your OAuth Integration

### 1. Test Each Provider Separately

```bash
# Start development server
npm run dev

# Open browser and navigate to login page
# Try each OAuth provider button
```

### 2. Test the Username Prompt

- Verify the modal appears after authentication
- Verify pre-filled username from OAuth provider
- Verify username can be edited
- Verify Cancel button works
- Verify Continue button validates empty username

### 3. Test Data Storage

```javascript
// Open browser console after login
console.log(JSON.parse(localStorage.getItem('user')));

// Should show:
// {
//   name: "username",
//   email: "email@example.com",
//   avatar: "...",
//   provider: "google|microsoft|apple",
//   plan: "Free Plan"
// }
```

### 4. Test Error Handling

- Test with incorrect Client IDs
- Test canceling authentication
- Test network errors
- Verify error messages are user-friendly

## Security Considerations

### Client-Side
- ✅ OAuth tokens never stored in localStorage
- ✅ Only user profile data is stored
- ✅ Proper CORS configuration
- ✅ HTTPS enforced in production

### Recommended Backend Implementation

For production applications, implement server-side token validation:

```javascript
// Example backend validation
app.post('/api/auth/verify-oauth', async (req, res) => {
  const { token, provider } = req.body;
  
  try {
    // Verify token with OAuth provider
    const userInfo = await verifyOAuthToken(token, provider);
    
    // Create session
    const session = createSession(userInfo);
    
    res.json({ success: true, session });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## Troubleshooting

### Common Issues

1. **"Client ID not configured" error**
   - Update the Client ID in `src/config.js`
   - Restart development server

2. **OAuth popup blocked**
   - Allow popups for your domain
   - Check browser popup settings

3. **Redirect URI mismatch**
   - Ensure redirect URIs match exactly in OAuth provider settings
   - Include protocol (http/https)
   - Include port for development (e.g., :5173)

4. **CORS errors**
   - Check allowed origins in OAuth provider settings
   - Ensure proper HTTPS in production

5. **Username prompt doesn't appear**
   - Check browser console for errors
   - Verify state management in React DevTools

## Environment Variables (Production)

For production deployments, use environment variables:

```bash
# .env.production
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

Update `src/config.js`:

```javascript
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
export const MICROSOFT_CONFIG = {
  clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID',
  // ...
};
export const APPLE_CONFIG = {
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID',
  // ...
};
```

## Deployment Checklist

- [ ] Update OAuth Client IDs for production
- [ ] Add production redirect URIs to OAuth provider settings
- [ ] Verify HTTPS is configured
- [ ] Test OAuth flow in production environment
- [ ] Test error handling
- [ ] Monitor OAuth success/failure rates
- [ ] Set up backend token validation (recommended)

## Support & Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)

## Need Help?

If you encounter issues:
1. Check the provider-specific setup guides
2. Review the error messages carefully
3. Check browser console for detailed errors
4. Verify all configuration values are correct
5. Test with a fresh OAuth consent (revoke and re-authorize)

## Future Enhancements

- 📱 Phone authentication
- 🔐 Two-factor authentication
- 🔄 Token refresh handling
- 👥 Account linking (multiple OAuth providers for one user)
- 📊 Analytics for authentication methods

