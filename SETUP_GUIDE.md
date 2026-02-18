# GramSathi - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🚀 Installation Steps

### Step 1: Clone or Navigate to Project

```bash
cd c:\GramSathi
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
```bash
copy .env.example .env
```

2. Open `.env` file and configure the following:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gramsathi
JWT_SECRET=gramsathi_secret_key_2024_secure
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL
CLIENT_URL=http://localhost:3000
```

#### 2.3 Gmail Setup for Email OTP

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
   - Use this password in `EMAIL_PASS` field

#### 2.4 Twilio Setup for SMS OTP (Optional)

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token from the dashboard
3. Get a Twilio phone number
4. Add these credentials to your `.env` file

**Note:** For development, you can skip Twilio setup. The app will still work with email OTP only.

#### 2.5 Start MongoDB

Open a new terminal and start MongoDB:

```bash
mongod
```

Or if MongoDB is installed as a service:

```bash
net start MongoDB
```

#### 2.6 Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

### Step 3: Frontend Setup

Open a new terminal window:

#### 3.1 Install Frontend Dependencies

```bash
cd c:\GramSathi\frontend
npm install
```

#### 3.2 Start Frontend Development Server

```bash
npm start
```

The application will open automatically at `http://localhost:3000`

## 🎯 Testing the Application

### 1. Register a New User

1. Go to `http://localhost:3000/register`
2. Fill in the registration form:
   - Name: Test User
   - Email: your_email@gmail.com
   - Phone: +919876543210
   - Password: Test@123
   - Role: Villager
   - Village: Test Village
   - Address: Test Address

3. Click "Register"
4. You will receive an OTP via email (and SMS if Twilio is configured)
5. Enter the OTP to verify your account

### 2. Login

1. Go to `http://localhost:3000/login`
2. Enter your phone number and password
3. Click "Login"

### 3. Test Features

#### As Villager:
- Submit complaints
- View development projects
- Check upcoming events
- Browse welfare schemes
- View budget transparency

#### As Admin:
- Create an admin account during registration
- Manage all complaints
- Create and manage projects
- Add fund entries
- Create events
- Add welfare schemes
- View analytics dashboard

## 📦 Project Structure

```
GramSathi/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── complaintController.js   # Complaint management
│   │   ├── projectController.js     # Project management
│   │   ├── fundController.js        # Fund management
│   │   ├── eventController.js       # Event management
│   │   ├── schemeController.js      # Welfare scheme management
│   │   └── notificationController.js # Notifications
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Complaint.js             # Complaint schema
│   │   ├── Project.js               # Project schema
│   │   ├── Fund.js                  # Fund schema
│   │   ├── Event.js                 # Event schema
│   │   ├── WelfareScheme.js         # Welfare scheme schema
│   │   └── Notification.js          # Notification schema
│   ├── routes/
│   │   └── [all route files]        # API routes
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication
│   ├── utils/
│   │   └── notification.js          # Email/SMS utilities
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js            # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── ForgotPassword.js    # Password reset
│   │   │   ├── Dashboard.js         # Main dashboard
│   │   │   ├── Complaints.js        # Complaint management
│   │   │   ├── Projects.js          # Project listing
│   │   │   ├── Funds.js             # Budget transparency
│   │   │   ├── Events.js            # Event calendar
│   │   │   └── Schemes.js           # Welfare schemes
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   └── tailwind.config.js           # Tailwind CSS config
│
└── README.md                        # Project documentation
```

## 🔧 Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check if MongoDB is installed correctly
- Verify `MONGODB_URI` in `.env` file

### Issue 2: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
- Change the port in `.env` file: `PORT=5001`
- Or kill the process using port 5000

### Issue 3: Email OTP Not Sending

**Solution:**
- Verify Gmail credentials in `.env`
- Ensure you're using App Password, not regular password
- Check if 2FA is enabled on your Google account
- Check spam folder

### Issue 4: Frontend Not Loading

**Solution:**
- Clear browser cache
- Delete `node_modules` and run `npm install` again
- Check if backend is running on port 5000

## 🌟 Key Features Implemented

✅ **Module 1: User Management**
- Phone/Email OTP registration
- JWT authentication
- Role-based access (Villager, Admin, Worker, SuperAdmin)
- Forgot password with OTP
- Profile management

✅ **Module 2: Complaint Management**
- Submit complaints with categories
- Status tracking
- Admin assignment
- Priority levels
- Photo upload support (ready)

✅ **Module 3: Development Work Tracker**
- Project listing with progress
- Budget tracking
- Contractor information
- Status management
- Public transparency

✅ **Module 4: Budget & Fund Transparency**
- Fund allocation tracking
- Category-wise distribution
- Source-wise analysis
- Visual charts (Pie & Bar)
- Expenditure breakdown

✅ **Module 5: Village Events & Welfare**
- Event calendar
- Event types (Meeting, Health Camp, etc.)
- Upcoming event notifications
- Government welfare schemes
- Eligibility criteria
- Required documents
- Application links

✅ **Module 6: Analytics Dashboard**
- Complaint statistics
- Project completion rates
- Budget usage graphs
- Category-wise distribution
- Real-time data

✅ **Module 7: Notification System**
- Email notifications
- SMS alerts (with Twilio)
- In-app notifications (ready)
- Announcement board (ready)

## 🎨 User Roles & Permissions

### Villager
- Submit and track complaints
- View all projects
- Check upcoming events
- Browse welfare schemes
- View budget transparency

### Panchayat Admin
- All villager permissions
- Manage complaints (assign, update status)
- Create and manage projects
- Add fund entries
- Create events
- Add welfare schemes
- View analytics dashboard

### Worker
- View assigned complaints
- Update complaint status
- Add resolution notes

### Super Admin
- Full system access
- User management
- System configuration

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Complaints
- `POST /api/complaints` - Create complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update complaint
- `PUT /api/complaints/:id/assign` - Assign to worker
- `GET /api/complaints/stats` - Get statistics

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats` - Get statistics

### Funds
- `POST /api/funds` - Add fund entry
- `GET /api/funds` - Get all funds
- `GET /api/funds/stats` - Get fund statistics

### Events
- `POST /api/events` - Create event
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Welfare Schemes
- `POST /api/schemes` - Create scheme
- `GET /api/schemes` - Get all schemes
- `GET /api/schemes/:id` - Get single scheme
- `PUT /api/schemes/:id` - Update scheme
- `DELETE /api/schemes/:id` - Delete scheme

## 🚀 Deployment Guide

### Backend Deployment (Render)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Create new Web Service
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables from `.env`
7. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your GitHub repository
4. Configure:
   - Framework: Create React App
   - Root Directory: `frontend`
5. Deploy

### Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in production environment

## 📞 Support

For issues or questions:
- Check the documentation
- Review common issues section
- Contact the development team

## 📄 License

MIT License - Feel free to use for educational purposes

---

**GramSathi** - Empowering Villages Through Technology 🌾
