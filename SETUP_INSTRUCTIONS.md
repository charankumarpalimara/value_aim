# Value Aim Integration - Setup Instructions

This project consists of a React frontend and Node.js/Express backend with MongoDB.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/value_aim_db
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

### 5. Start Backend Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend server will start on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory (from project root)

```bash
cd ../
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com
```

### 4. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173`
   - Your production URL
6. Copy the Client ID and update:
   - `.env` file: `VITE_GOOGLE_CLIENT_ID`
   - `src/config.js`: `GOOGLE_CLIENT_ID`

See `GOOGLE_OAUTH_SETUP.md` for detailed instructions.

### 5. Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Project Structure

```
value_aim_integration/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── .env               # Environment variables (create this)
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
├── src/                    # Frontend source
│   ├── components/        # React components
│   │   ├── tabs/         # Tab components
│   │   ├── LoginPage.jsx
│   │   ├── CompanyDetailsPage.jsx
│   │   ├── ServiceDetailsForm.jsx
│   │   └── ResultsPage.jsx
│   ├── utils/            # Utility functions
│   │   └── api.js       # API client
│   ├── config.js        # Frontend config
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
│
├── .env                  # Frontend environment variables (create this)
├── package.json          # Frontend dependencies
└── vite.config.js       # Vite configuration
```

## Features Implemented

### Backend Features
- ✅ User authentication (Email/Password & OAuth)
- ✅ JWT-based authorization
- ✅ Company details management
- ✅ Service details management
- ✅ User profile management
- ✅ Password change functionality
- ✅ Onboarding status tracking

### Frontend Features
- ✅ Landing page
- ✅ Login/Registration page
- ✅ Company details form (first-time login)
- ✅ Service details form with table
- ✅ Results page with tabs
- ✅ Profile management screen
- ✅ Organization details screen
- ✅ Service manager screen
- ✅ Responsive design

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/onboarding` - Update onboarding status

### Company
- `POST /api/company` - Create/Update company details
- `GET /api/company` - Get company details
- `DELETE /api/company` - Delete company details

### Services
- `POST /api/service` - Create service
- `GET /api/service` - Get all services
- `GET /api/service/:id` - Get single service
- `PUT /api/service/:id` - Update service
- `DELETE /api/service/:id` - Delete service
- `POST /api/service/bulk` - Bulk create/update services

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `PUT /api/user/plan` - Update user plan

## Testing

### Test Backend API

Health check:
```bash
curl http://localhost:5000/api/health
```

Register user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Test Frontend

1. Open browser to `http://localhost:5173`
2. Click "Get Started" or "Login"
3. Complete registration/login
4. Fill out company details (optional, can skip)
5. Fill out service details (optional, can skip)
6. Access the results page
7. Click profile menu to access:
   - My Profile
   - Organization Details
   - Service Manager

## Default First-Time Flow

When a user logs in for the first time:
1. Redirect to Company Details page
2. After submission → Redirect to Service Details page
3. After submission → Redirect to Results page (main application)

Inside the application (ResultsPage), users can:
- Access Profile via profile menu
- Edit Organization Details via profile menu
- Manage Services via Service Manager in profile menu

## Troubleshooting

### Backend Issues

**MongoDB connection failed:**
- Make sure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify MongoDB is accessible on port 27017

**Port already in use:**
- Change PORT in backend `.env`
- Kill process using the port: `lsof -ti:5000 | xargs kill`

### Frontend Issues

**API calls failing:**
- Verify backend is running
- Check VITE_API_URL in `.env`
- Check browser console for CORS errors

**Build errors:**
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set a strong `JWT_SECRET`
4. Deploy to a platform like Heroku, DigitalOcean, or AWS

### Frontend

1. Update `VITE_API_URL` to production backend URL
2. Build the project:
```bash
npm run build
```
3. Deploy the `dist` folder to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Your own server with Nginx

## Support

For issues or questions:
1. Check the documentation files
2. Review console errors
3. Check API endpoint responses
4. Verify environment variables are set correctly

## License

This project is private and proprietary.

