# Value Aim Integration - Complete Project Overview

## 🎯 Project Description

A full-stack application for managing company and service details with user authentication, profile management, and a comprehensive dashboard interface.

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- RESTful API architecture
- JWT-based authentication
- MongoDB for data persistence
- Proper MVC pattern with controllers, models, and routes

### Frontend (React + Vite + Ant Design)
- Modern React with hooks
- Ant Design component library for UI
- Responsive design for all screen sizes
- Client-side routing with React Router

## ✨ Key Features

### Authentication & Authorization
- ✅ Email/Password registration and login
- ✅ OAuth integration support (Google, Microsoft, Apple)
- ✅ JWT token-based authentication
- ✅ Protected routes and API endpoints
- ✅ First-time login flow with onboarding

### User Management
- ✅ Profile management with avatar upload
- ✅ Password change functionality
- ✅ Plan management (Free, Pro, Enterprise)
- ✅ Account settings and preferences

### Company Management
- ✅ Complete company details form
- ✅ Industry, location, and employee count tracking
- ✅ Company description and website
- ✅ Edit and update company information

### Service Management
- ✅ Service offerings management
- ✅ Keywords and adjacency expansion
- ✅ Target industry and function type
- ✅ Target segment selection
- ✅ Service status management (Active/Inactive)
- ✅ Bulk operations support
- ✅ Inline editing with table interface
- ✅ Search and filter functionality

### Dashboard & Analytics
- ✅ Journey Matrix visualization
- ✅ Business Opportunity tracking
- ✅ Partnership management
- ✅ Business Value analysis
- ✅ Competitor insights
- ✅ Business Review reports
- ✅ Customer Insights
- ✅ Meeting Coach
- ✅ Churn Prediction
- ✅ Revenue Leak detection
- ✅ Account Playbook
- ✅ Notes management

## 📁 Project Structure

```
value_aim_integration/new_work/
│
├── backend/                           # Backend API Server
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Authentication logic
│   │   ├── companyController.js      # Company CRUD operations
│   │   ├── serviceController.js      # Service CRUD operations
│   │   └── userController.js         # User profile operations
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Company.js                # Company schema
│   │   └── Service.js                # Service schema
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   ├── companyRoutes.js          # Company endpoints
│   │   ├── serviceRoutes.js          # Service endpoints
│   │   └── userRoutes.js             # User endpoints
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   ├── package.json                  # Dependencies
│   ├── server.js                     # Entry point
│   └── README.md                     # Backend documentation
│
├── src/                              # Frontend Source
│   ├── components/
│   │   ├── tabs/                     # Tab components
│   │   │   ├── ProfileTab.jsx        # ✨ NEW: User profile screen
│   │   │   ├── OrganizationDetailsTab.jsx  # ✨ NEW: Company details screen
│   │   │   ├── ServiceManagerTab.jsx # ✨ NEW: Service manager screen
│   │   │   ├── JourneyMatrixTab.jsx
│   │   │   ├── BusinessOpportunityTab.jsx
│   │   │   ├── PartnershipTab.jsx
│   │   │   ├── BusinessValueTab.jsx
│   │   │   ├── CompetitorTab.jsx
│   │   │   ├── BusinessReviewTab.jsx
│   │   │   ├── CustomerInsightsTab.jsx
│   │   │   ├── MeetingCoachTab.jsx
│   │   │   ├── ChurnPredictionTab.jsx
│   │   │   ├── RevenueLeakTab.jsx
│   │   │   ├── AccountPlaybookTab.jsx
│   │   │   └── NotesTab.jsx
│   │   ├── BrandLogos.jsx
│   │   ├── FormFlow.jsx
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CompanyDetailsPage.jsx
│   │   ├── ServiceDetailsForm.jsx
│   │   └── ResultsPage.jsx           # ✨ UPDATED: Added new screens
│   ├── utils/
│   │   └── api.js                    # ✨ NEW: API client utilities
│   ├── styles/
│   │   └── global.css
│   ├── config.js                     # ✨ UPDATED: Configuration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env.example                      # Frontend env template
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
├── SETUP_INSTRUCTIONS.md             # ✨ NEW: Setup guide
└── PROJECT_OVERVIEW.md               # ✨ NEW: This file
```

## 🔄 User Flow

### First-Time User Flow

```
Landing Page
    ↓
Login/Register
    ↓
[First Login Detected]
    ↓
Company Details Form (Optional - Can Skip)
    ↓
Service Details Form (Optional - Can Skip)
    ↓
Results Page (Main Dashboard)
```

### Returning User Flow

```
Landing Page
    ↓
Login
    ↓
Results Page (Main Dashboard)
    ↓
Access Profile Menu:
    • My Profile
    • Organization Details
    • Service Manager
    • Settings
    • Help
    • Upgrade Plan
    • Logout
```

### Inside Results Page Navigation

Users can access:
1. **Company Tabs** (Bank of America, Cisco, AIG)
   - Journey Matrix
   - Business Opportunity
   - Partnership
   - Business Value
   - Competitor
   - Business Review

2. **Sidebar Submenu Options**
   - Insights (Customer Insights)
   - Account Playbook
   - Meet Coach
   - Churn Prediction
   - Revenue Leak
   - Notes

3. **Profile Menu** (Bottom of sidebar)
   - My Profile → ProfileTab
   - Organization Details → OrganizationDetailsTab
   - Service Manager → ServiceManagerTab
   - Suggestions
   - Settings
   - Help
   - Upgrade Plan
   - Logout

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  provider: String (email/google/microsoft/apple),
  providerId: String,
  picture: String (URL),
  isFirstLogin: Boolean,
  hasCompletedOnboarding: Boolean,
  companyDetailsCompleted: Boolean,
  serviceDetailsCompleted: Boolean,
  plan: String (Free Plan/Pro Plan/Enterprise Plan),
  createdAt: Date,
  updatedAt: Date
}
```

### Company Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  companyName: String,
  industry: String,
  website: String,
  country: String,
  city: String,
  employees: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  interests: [String],
  keywords: [String],
  adjacencyExpansion: [String],
  targetIndustry: [String],
  functionType: [String],
  targetSegment: [String],
  offerStatus: String (Active/Inactive),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/onboarding` | Update onboarding | Yes |

### Company
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/company` | Create/Update company | Yes |
| GET | `/api/company` | Get company details | Yes |
| DELETE | `/api/company` | Delete company | Yes |

### Services
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/service` | Create service | Yes |
| GET | `/api/service` | Get all services | Yes |
| GET | `/api/service/:id` | Get single service | Yes |
| PUT | `/api/service/:id` | Update service | Yes |
| DELETE | `/api/service/:id` | Delete service | Yes |
| POST | `/api/service/bulk` | Bulk create services | Yes |

### User
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update profile | Yes |
| PUT | `/api/user/password` | Change password | Yes |
| PUT | `/api/user/plan` | Update plan | Yes |

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Frontend Setup
```bash
cd ..
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

See `SETUP_INSTRUCTIONS.md` for detailed setup guide.

## 🎨 UI Components

### Ant Design Components Used
- Table (with inline editing)
- Form (with validation)
- Input, Select, Switch
- Button, Modal, Popconfirm
- Card, Space, Tag
- Upload (for avatar)
- Message (for notifications)

### Custom Styling
- Custom CSS for responsive design
- Inline styles for specific components
- Theme colors matching brand (#201F47)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ HTTP-only secure token handling
- ✅ Protected API routes
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variable security

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop full features
- ✅ Collapsible sidebar
- ✅ Responsive tables
- ✅ Touch-friendly interface

## 🧪 Testing Recommendations

### Backend Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Frontend Testing
1. Open http://localhost:5173
2. Test registration flow
3. Test login flow
4. Test first-time user flow (company → service → results)
5. Test profile management
6. Test service manager table operations

## 📝 Future Enhancements

### Potential Features
- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Export data to CSV/PDF
- [ ] Real-time notifications
- [ ] Team collaboration features
- [ ] API rate limiting
- [ ] Audit logs
- [ ] Advanced search and filters

## 🐛 Known Issues

None at the moment. Please report any issues you encounter.

## 📚 Documentation

- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `backend/README.md` - Backend API documentation
- `GOOGLE_OAUTH_SETUP.md` - OAuth configuration guide

## 🤝 Contributing

This is a private project. For questions or contributions, please contact the project maintainer.

## 📄 License

Private and Proprietary

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**

