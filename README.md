# 🌾 GramSathi - Digital Village Governance Platform

A comprehensive digital platform that bridges the gap between village administration and citizens, enabling transparent governance, efficient complaint management, and community engagement.

## 🚀 Live Demo
- **Frontend**: [Live Application](your-frontend-url)
- **Backend API**: [API Documentation](your-backend-url)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Multi-Role Authentication
- **4 User Roles**: Villager, Worker, Admin, SuperAdmin
- **OTP Verification**: Phone and Email-based authentication
- **JWT Security**: Secure token-based sessions
- **Password Recovery**: Forgot password with OTP

### 📱 Smart Complaint Management
- Submit complaints with photos and location
- 5 Categories: Water, Road, Electricity, Sanitation, Other
- Priority levels: Low, Medium, High
- Status tracking: Pending → In Progress → Resolved
- Admin assignment to workers
- Real-time notifications

### 🏗️ Development Project Tracker
- Track infrastructure projects with progress percentage
- Budget allocation and spending transparency
- Contractor information management
- Timeline tracking with completion status
- Public visibility for accountability

### 💰 Budget & Fund Transparency
- Government fund tracking by source/scheme
- Real-time expenditure monitoring
- Category-wise spending breakdown
- Visual charts and analytics
- Balance calculation and alerts

### 📅 Village Events Management
- Event calendar with upcoming events
- 5 Event types: Meeting, Health Camp, Cultural Program, Vaccination Drive, Other
- Date, time, and location details
- Countdown timers and notifications

### 🎯 Government Welfare Schemes Portal
- Comprehensive scheme information
- 6 Categories: Pension, Housing, Education, Agriculture, Healthcare, Other
- Eligibility criteria and required documents
- Direct application links
- Search and filter functionality

### 📊 Analytics & Reporting Dashboard
- Fund analytics (Received, Spent, Balance)
- Complaint statistics by category
- Project completion rates
- Visual charts and graphs
- Real-time data updates

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Toastify** - Notifications
- **Recharts** - Data Visualization
- **React Icons** - Icon Library

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **Twilio** - SMS Service

## 📥 Installation

### Prerequisites
```bash
Node.js v16 or higher
MongoDB v5 or higher
npm or yarn
Git
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/gramsathi.git
cd gramsathi
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gramsathi
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 4. Access Application
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

## 🎯 Usage

### For Villagers
1. **Register** with phone number and OTP verification
2. **Submit Complaints** with photos and location
3. **Track Status** of submitted complaints
4. **View Events** and upcoming programs
5. **Explore Schemes** and check eligibility

### For Admins
1. **Manage Complaints** - Assign to workers, update status
2. **Create Projects** - Add infrastructure projects
3. **Track Funds** - Monitor budget and expenditure
4. **Organize Events** - Schedule village programs
5. **Add Schemes** - Update welfare schemes
6. **View Analytics** - Dashboard with insights

### For Workers
1. **View Assigned Complaints**
2. **Update Progress** and status
3. **Add Resolution Notes**
4. **Mark as Resolved**

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/login` | User login |
| POST | `/auth/forgot-password` | Reset password |
| GET | `/auth/profile` | Get user profile |

### Complaints Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/complaints` | Create complaint |
| GET | `/complaints` | Get all complaints |
| PUT | `/complaints/:id` | Update complaint |
| GET | `/complaints/stats` | Get statistics |

### Projects Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create project |
| GET | `/projects` | Get all projects |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React.js Frontend (Port 3000)                      │  │
│  │   - Components (Reusable UI)                         │  │
│  │   - Pages (Route-based views)                        │  │
│  │   - Context API (State Management)                   │  │
│  │   - Axios (API Communication)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Node.js + Express.js Backend (Port 5000)           │  │
│  │                                                        │  │
│  │   ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │  │
│  │   │  Routes     │→ │ Controllers  │→ │  Models   │  │  │
│  │   │ (Endpoints) │  │  (Business   │  │ (Schema)  │  │  │
│  │   │             │  │   Logic)     │  │           │  │  │
│  │   └─────────────┘  └──────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   MongoDB Atlas (Cloud Database)                     │  │
│  │   - Users Collection                                 │  │
│  │   - Complaints Collection                            │  │
│  │   - Projects Collection                              │  │
│  │   - Funds Collection                                 │  │
│  │   - Events Collection                                │  │
│  │   - WelfareSchemes Collection                        │  │
│  │   - Notifications Collection                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  phone: String (unique),
  email: String,
  password: String (hashed),
  role: Enum ['villager', 'worker', 'admin', 'superadmin'],
  village: String,
  address: String,
  profilePic: String,
  isVerified: Boolean,
  createdAt: Date
}
```

### Complaints Collection
```javascript
{
  title: String,
  description: String,
  category: Enum ['Water', 'Road', 'Electricity', 'Sanitation', 'Other'],
  priority: Enum ['Low', 'Medium', 'High'],
  status: Enum ['Pending', 'In Progress', 'Resolved'],
  address: String,
  photo: String,
  userId: ObjectId,
  assignedTo: ObjectId,
  resolutionNote: String,
  createdAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **OTP Verification** - Phone/Email verification
- **Role-Based Access** - Permission-based routes
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin security

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy to platform
```

### Database (MongoDB Atlas)
- Create cluster
- Configure connection string
- Set up collections

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name](https://github.com/yourusername)
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- **Digital India Initiative** - Inspiration for digital governance
- **Village Communities** - Real-world problem insights
- **Open Source Community** - Tools and libraries

## 📞 Support

For support, email your.email@example.com or create an issue on GitHub.

---

**Built with ❤️ for Digital India Initiative**

*Empowering Villages Through Technology*