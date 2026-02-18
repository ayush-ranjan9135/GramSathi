# 🏘️ GramSathi - Digital Village Governance Platform

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Database Design](#database-design)
- [API Documentation](#api-documentation)
- [UI/UX Enhancements](#uiux-enhancements)
- [Installation Guide](#installation-guide)
- [Project Workflow](#project-workflow)
- [Security Features](#security-features)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Problem Statement

### Current Challenges in Rural Governance:
1. **Lack of Transparency** - Citizens have no visibility into government fund allocation and spending
2. **Inefficient Complaint Management** - Manual complaint tracking leads to delays and lost complaints
3. **Poor Communication** - No centralized platform for announcements and event notifications
4. **Limited Accessibility** - Citizens must physically visit panchayat offices for information
5. **No Accountability** - Difficult to track project progress and complaint resolution
6. **Information Gap** - Villagers unaware of government welfare schemes and eligibility

### Impact:
- Delayed resolution of civic issues (water, roads, electricity)
- Mismanagement of public funds
- Low citizen engagement in governance
- Missed opportunities for welfare benefits

---

## 💡 Solution Overview

**GramSathi** is a comprehensive digital platform that bridges the gap between village administration and citizens, enabling:
- Real-time complaint tracking and resolution
- Transparent fund management and project monitoring
- Centralized information hub for events and welfare schemes
- Role-based access for different stakeholders
- Data-driven decision making through analytics

---

## ✨ Key Features

### 1. **Multi-Role Authentication System**
- **4 User Roles**: Villager, Worker, Admin, SuperAdmin
- **OTP Verification**: Phone and Email-based authentication
- **JWT Security**: Secure token-based sessions
- **Password Recovery**: Forgot password with OTP

### 2. **Smart Complaint Management**
- Submit complaints with photos and location
- 5 Categories: Water, Road, Electricity, Sanitation, Other
- Priority levels: Low, Medium, High
- Status tracking: Pending → In Progress → Resolved
- Admin assignment to workers
- Resolution notes and timestamps
- Real-time notifications

### 3. **Development Project Tracker**
- Track infrastructure projects with progress percentage
- Budget allocation and spending transparency
- Contractor information management
- Timeline tracking (start date, end date, completion)
- Status monitoring: Planning, Ongoing, Completed
- Public visibility for accountability

### 4. **Budget & Fund Transparency**
- Government fund tracking by source/scheme
- Real-time expenditure monitoring
- Category-wise spending breakdown
- Visual charts (Pie, Bar, Line graphs)
- Balance calculation and alerts
- Export functionality for reports

### 5. **Village Events Management**
- Event calendar with upcoming events
- 5 Event types: Meeting, Health Camp, Cultural Program, Vaccination Drive, Other
- Date, time, and location details
- Countdown timers for upcoming events
- Event details modal with full information
- Automatic notifications to citizens

### 6. **Government Welfare Schemes Portal**
- Comprehensive scheme information
- 6 Categories: Pension, Housing, Education, Agriculture, Healthcare, Other
- Eligibility criteria checklist
- Required documents list
- Benefits breakdown
- Direct application links
- Search and filter functionality

### 7. **Analytics & Reporting Dashboard**
- **Admin Dashboard**:
  - Fund analytics (Received, Spent, Balance)
  - Complaint statistics by category
  - Project completion rates
  - Recent complaints table with quick actions
  - Visual charts and graphs
- **User Dashboard**:
  - Personal activity tracking
  - Upcoming events with details
  - Quick access to services

### 8. **Notification System**
- Real-time notifications for:
  - Complaint status updates
  - New event announcements
  - Project milestones
  - General announcements
- Type-based filtering
- Mark as read functionality
- Icon-based visual indicators

### 9. **Profile Management**
- Profile picture upload with preview
- Personal information management
- Village and address details
- Account verification status
- Edit mode with validation

---

## 🏗️ System Architecture

### Architecture Pattern: **MVC (Model-View-Controller)**

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
│  │                                                        │  │
│  │   ┌─────────────────────────────────────────────┐    │  │
│  │   │  Middleware                                  │    │  │
│  │   │  - JWT Authentication                        │    │  │
│  │   │  - CORS                                      │    │  │
│  │   │  - Body Parser                               │    │  │
│  │   └─────────────────────────────────────────────┘    │  │
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

### Request Flow:
1. **User Action** → React Component
2. **API Call** → Axios Service
3. **Route Handler** → Express Router
4. **Authentication** → JWT Middleware
5. **Business Logic** → Controller
6. **Data Access** → Mongoose Model
7. **Database Query** → MongoDB
8. **Response** → JSON Data back to client

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | UI Framework | 18.x |
| **Tailwind CSS** | Styling | 3.x |
| **React Router** | Navigation | 6.x |
| **Axios** | HTTP Client | 1.x |
| **React Toastify** | Notifications | 9.x |
| **Recharts** | Data Visualization | 2.x |
| **React Icons** | Icon Library | 4.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 16+ |
| **Express.js** | Web Framework | 4.x |
| **MongoDB** | Database | 5+ |
| **Mongoose** | ODM | 7.x |
| **JWT** | Authentication | 9.x |
| **Bcrypt** | Password Hashing | 5.x |
| **Nodemailer** | Email Service | 6.x |
| **Twilio** | SMS Service | 4.x |

### Development Tools
- **Git** - Version Control
- **VS Code** - IDE
- **Postman** - API Testing
- **MongoDB Compass** - Database GUI

---

## 💾 Database Design

### Collections Schema

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, unique),
  email: String,
  password: String (hashed),
  role: Enum ['villager', 'worker', 'admin', 'superadmin'],
  village: String,
  address: String,
  profilePic: String (base64),
  isVerified: Boolean,
  otp: String,
  otpExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Complaints Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: Enum ['Water', 'Road', 'Electricity', 'Sanitation', 'Other'],
  priority: Enum ['Low', 'Medium', 'High'],
  status: Enum ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
  address: String,
  photo: String (base64),
  userId: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  resolutionNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Projects Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String,
  category: Enum ['Road', 'Water', 'Electricity', 'Building', 'Other'],
  budget: Number (required),
  spent: Number,
  status: Enum ['Planning', 'Ongoing', 'Completed'],
  progress: Number (0-100),
  contractor: String,
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Funds Collection
```javascript
{
  _id: ObjectId,
  schemeName: String (required),
  amount: Number (required),
  source: String,
  category: String,
  date: Date,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. Events Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  type: Enum ['Meeting', 'Health Camp', 'Cultural Program', 'Vaccination Drive', 'Other'],
  date: Date (required),
  time: String (required),
  location: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. WelfareSchemes Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  category: Enum ['Pension', 'Housing', 'Education', 'Agriculture', 'Healthcare', 'Other'],
  eligibility: String (required),
  documents: String (required),
  benefits: String (required),
  applyLink: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 7. Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String (required),
  message: String (required),
  type: Enum ['Complaint', 'Event', 'Project', 'Announcement', 'General'],
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships
- **One-to-Many**: User → Complaints (One user can have multiple complaints)
- **One-to-Many**: User → Notifications (One user can have multiple notifications)
- **Reference**: Complaint.assignedTo → User (Worker assigned to complaint)

---

## 🔌 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user with OTP | No |
| POST | `/auth/verify-otp` | Verify OTP and activate account | No |
| POST | `/auth/login` | Login with phone/password | No |
| POST | `/auth/forgot-password` | Request password reset OTP | No |
| POST | `/auth/reset-password` | Reset password with OTP | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |

### Complaints Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/complaints` | Create new complaint | Yes (Villager) |
| GET | `/complaints` | Get all complaints | Yes |
| GET | `/complaints/:id` | Get single complaint | Yes |
| PUT | `/complaints/:id` | Update complaint status | Yes (Admin/Worker) |
| PUT | `/complaints/:id/assign` | Assign complaint to worker | Yes (Admin) |
| GET | `/complaints/stats` | Get complaint statistics | Yes (Admin) |

### Projects Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/projects` | Create new project | Yes (Admin) |
| GET | `/projects` | Get all projects | Yes |
| GET | `/projects/:id` | Get single project | Yes |
| PUT | `/projects/:id` | Update project | Yes (Admin) |
| DELETE | `/projects/:id` | Delete project | Yes (Admin) |
| GET | `/projects/stats` | Get project statistics | Yes (Admin) |

### Funds Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/funds` | Add fund entry | Yes (Admin) |
| GET | `/funds` | Get all funds | Yes |
| GET | `/funds/stats` | Get fund statistics | Yes (Admin) |

### Events Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/events` | Create new event | Yes (Admin) |
| GET | `/events` | Get all events | Yes |
| GET | `/events/upcoming` | Get upcoming events | Yes |
| PUT | `/events/:id` | Update event | Yes (Admin) |
| DELETE | `/events/:id` | Delete event | Yes (Admin) |

### Welfare Schemes Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/schemes` | Create new scheme | Yes (Admin) |
| GET | `/schemes` | Get all schemes | Yes |
| GET | `/schemes/:id` | Get single scheme | Yes |
| PUT | `/schemes/:id` | Update scheme | Yes (Admin) |
| DELETE | `/schemes/:id` | Delete scheme | Yes (Admin) |

### Notifications Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| PUT | `/notifications/:id/read` | Mark notification as read | Yes |
| POST | `/notifications/announcement` | Create announcement | Yes (Admin) |

---

## 🎨 UI/UX Enhancements

### Design System
- **Color Palette**:
  - Primary: Blue (#2563eb)
  - Success: Green (#10b981)
  - Warning: Yellow (#f59e0b)
  - Danger: Red (#ef4444)
  - Background: Slate (#f8fafc)

- **Typography Scale**:
  - Page Title: 28px (text-3xl)
  - Card Title: 20px (text-xl)
  - Body Text: 14-15px (text-sm/base)
  - Meta Info: 13px (text-xs)
  - Badge: 12px (text-xs)

- **Spacing System**:
  - Page Padding: 32px (p-8)
  - Card Padding: 24px (p-6)
  - Gap: 24px (gap-6)

- **Border Radius**:
  - Cards: 12px (rounded-xl)
  - Buttons: 8px (rounded-lg)
  - Badges: 20px (rounded-full)

### Key UI Features
1. **Professional Page Headers**
   - Large title with description
   - Primary action button
   - Divider line for separation

2. **Summary Statistics Cards**
   - Gradient backgrounds for fund cards
   - Clear labels and large numbers
   - Consistent layout across pages

3. **Search & Filter Bars**
   - Icon-prefixed inputs
   - Dropdown filters
   - Responsive layout

4. **Modern Card Design**
   - Soft shadows (shadow-sm)
   - Subtle borders (border-gray-100)
   - Hover effects (scale, shadow)
   - Smooth transitions (200ms)

5. **Status Indicators**
   - Colored dots with labels
   - Pill-shaped badges
   - Color-coded by status/priority

6. **Empty States**
   - Large emoji icons
   - Helpful messages
   - Contextual suggestions

7. **Interactive Elements**
   - Hover animations
   - Loading states
   - Success/error feedback
   - Modal dialogs

8. **Responsive Design**
   - Mobile-first approach
   - Grid layouts (1 col mobile, 2-3 cols desktop)
   - Touch-friendly buttons
   - Collapsible sidebar

---

## 📥 Installation Guide

### Prerequisites
```bash
Node.js v16 or higher
MongoDB v5 or higher
npm or yarn
Git
```

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd GramSathi
```

### Step 2: Backend Setup
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

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### Step 4: Access Application
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## 🔄 Project Workflow

### User Journey: Villager

1. **Registration**
   - Enter name, phone, email, password
   - Select role as "Villager"
   - Receive OTP on phone/email
   - Verify OTP to activate account

2. **Login**
   - Enter phone and password
   - JWT token stored in localStorage
   - Redirected to dashboard

3. **Submit Complaint**
   - Navigate to Complaints page
   - Click "New Complaint"
   - Fill form (title, description, category, priority, location)
   - Upload photo (optional)
   - Submit complaint
   - Receive confirmation notification

4. **Track Complaint**
   - View complaint status in real-time
   - Receive notifications on status updates
   - View resolution notes when resolved

5. **View Events**
   - Browse upcoming village events
   - Click "Details" to see full information
   - Get countdown timers

6. **Explore Schemes**
   - Search welfare schemes
   - Filter by category
   - View eligibility and documents
   - Click "Apply Now" for external links

### Admin Journey

1. **Login as Admin**
   - Access admin dashboard
   - View analytics and statistics

2. **Manage Complaints**
   - View all complaints
   - Filter by status/category
   - Assign complaints to workers
   - Update status
   - Add resolution notes

3. **Manage Projects**
   - Create new infrastructure projects
   - Set budget and timeline
   - Update progress percentage
   - Track spending

4. **Manage Funds**
   - Add fund entries
   - View fund distribution charts
   - Monitor spending vs budget

5. **Manage Events**
   - Create village events
   - Set date, time, location
   - Notifications sent automatically

6. **Manage Schemes**
   - Add welfare schemes
   - Update eligibility criteria
   - Provide application links

### Worker Journey

1. **Login as Worker**
   - View assigned complaints

2. **Update Complaint Status**
   - Mark as "In Progress"
   - Add resolution notes
   - Mark as "Resolved"
   - Notifications sent to user

---

## 🔒 Security Features

### 1. Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Password Hashing**: Bcrypt with salt rounds
- **OTP Verification**: Phone and email verification
- **Role-Based Access Control**: Middleware checks user roles

### 2. Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Mongoose ODM prevents injection
- **XSS Protection**: React escapes output by default
- **CORS Configuration**: Controlled cross-origin requests

### 3. API Security
- **Rate Limiting**: Prevent brute force attacks (can be added)
- **HTTPS**: Encrypted data transmission (production)
- **Environment Variables**: Sensitive data in .env files
- **Token Expiry**: JWT tokens expire after 7 days

---

## 🚀 Future Enhancements

### Phase 1: Advanced Features
1. **Real-time Chat**: Admin-citizen communication
2. **Push Notifications**: Browser push notifications
3. **Multi-language Support**: Hindi, regional languages
4. **Voice Complaints**: Audio recording for illiterate users
5. **Geo-mapping**: Interactive map for complaints and projects

### Phase 2: Analytics & AI
1. **Predictive Analytics**: Forecast complaint trends
2. **AI Chatbot**: Automated query resolution
3. **Sentiment Analysis**: Analyze complaint urgency
4. **Recommendation Engine**: Suggest relevant schemes

### Phase 3: Integration
1. **Payment Gateway**: Online fee payments
2. **Aadhaar Integration**: Identity verification
3. **Government APIs**: Direct scheme application
4. **SMS Gateway**: Bulk SMS notifications
5. **WhatsApp Integration**: Status updates via WhatsApp

### Phase 4: Mobile App
1. **React Native App**: iOS and Android apps
2. **Offline Mode**: Work without internet
3. **Camera Integration**: Direct photo capture
4. **GPS Integration**: Auto-location detection

---

## 📊 Project Statistics

- **Total Files**: 50+
- **Lines of Code**: 5000+
- **API Endpoints**: 35+
- **Database Collections**: 7
- **User Roles**: 4
- **Modules**: 7
- **Pages**: 10+
- **Components**: 15+

---

## 🎯 Interview Talking Points

### Technical Highlights
1. **Full-Stack Development**: End-to-end implementation
2. **RESTful API Design**: Clean, scalable architecture
3. **State Management**: React Context API
4. **Authentication Flow**: JWT + OTP verification
5. **Database Design**: Normalized schema with relationships
6. **Responsive Design**: Mobile-first approach
7. **Code Organization**: MVC pattern, modular structure

### Problem-Solving Skills
1. **Real-world Problem**: Addressing rural governance challenges
2. **User-Centric Design**: Multiple user personas
3. **Scalability**: Designed for multiple villages
4. **Performance**: Optimized queries and lazy loading
5. **Security**: Multiple layers of protection

### Business Impact
1. **Transparency**: Public fund tracking
2. **Efficiency**: Faster complaint resolution
3. **Accessibility**: 24/7 access to services
4. **Accountability**: Audit trail for all actions
5. **Citizen Engagement**: Increased participation

---

## 📞 Contact & Support

**Developer**: [Your Name]
**Email**: [Your Email]
**GitHub**: [Your GitHub Profile]
**LinkedIn**: [Your LinkedIn Profile]

---

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Digital India Initiative**

*Empowering Villages Through Technology*
