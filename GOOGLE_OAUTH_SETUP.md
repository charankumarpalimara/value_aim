# Google OAuth Setup Instructions

## Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Click "New Project" and give it a name (e.g., "Value AIM Integration")
   - Or select an existing project

3. **Enable Google OAuth APIs**
   - In the left sidebar, click on "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - Choose "External" for user type
     - Fill in app name, user support email, and developer contact email
     - Save and continue
   
5. **Configure OAuth Client**
   - Select "Web application" as application type
   - Give it a name (e.g., "Value AIM Web Client")
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:5173` (for development)
     - `http://localhost:3000` (if you use port 3000)
     - Your production domain (e.g., `https://yourapp.com`)
   - Under "Authorized redirect URIs", add:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - Your production domain
   - Click "Create"

6. **Copy Your Client ID**
   - You'll see a popup with your Client ID and Client Secret
   - **Copy the Client ID** (it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - You don't need the Client Secret for this implementation

## Step 2: Add Client ID to Your Project

1. Open `src/config.js`
2. Replace `'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'` with your actual Client ID
3. Example:
   ```javascript
   export const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
   ```

## Step 3: Test the Implementation

1. Run your development server: `npm run dev`
2. Navigate to the login page
3. Click the "Google" button
4. You should see a Google sign-in popup
5. After signing in, user data will be stored in localStorage and you'll be redirected

## How It Works

1. **User clicks Google button** → `googleLogin()` is triggered
2. **Google OAuth popup appears** → User selects their Google account
3. **On success** → Access token is received
4. **Fetch user info** → Using the access token, we get user data from Google
5. **Store user data** → Save to localStorage: name, email, picture
6. **Navigate** → Redirect to company details page

## User Data Stored

After successful login, the following data is stored in localStorage:
```javascript
{
  name: "User Name",
  email: "user@gmail.com", 
  picture: "https://lh3.googleusercontent.com/...",
  provider: "google"
}
```

## Troubleshooting

### Error: "Invalid Client ID"
- Make sure you copied the entire Client ID
- Check for extra spaces or characters

### Error: "redirect_uri_mismatch"
- Add http://localhost:5173 to authorized redirect URIs in Google Console
- Make sure the URI matches exactly (including http vs https)

### Popup blocked
- Allow popups for localhost in your browser settings
- Try using a different browser

### "Access blocked: This app's request is invalid"
- Make sure the OAuth consent screen is configured
- Add test users if your app is not published

## Production Deployment

Before deploying to production:
1. Add your production domain to authorized JavaScript origins
2. Add your production domain to authorized redirect URIs  
3. Configure the OAuth consent screen properly
4. Consider publishing your app (if needed for public access)
5. Update the GOOGLE_CLIENT_ID in your production environment

