# GramSathi - Quick Reference

## 🚀 Quick Start Commands

### Installation
```bash
# Run installation script
install.bat

# Or manual installation
cd backend && npm install
cd ../frontend && npm install
```

### Start Application
```bash
# Start both servers
start.bat

# Or start manually
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm start
```

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/gramsathi

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| Villager | Submit complaints, view projects/events/schemes |
| Admin | Full access, create/manage all resources |
| Worker | View and update assigned complaints |
| SuperAdmin | Full system access |

## 📡 Key API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/forgot-password

### Complaints
- GET /api/complaints
- POST /api/complaints
- PUT /api/complaints/:id

### Projects
- GET /api/projects
- POST /api/projects
- GET /api/projects/stats

### Funds
- GET /api/funds
- POST /api/funds
- GET /api/funds/stats

### Events
- GET /api/events
- POST /api/events
- GET /api/events/upcoming

### Schemes
- GET /api/schemes
- POST /api/schemes

## 🎨 Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Auth: JWT + OTP (Email/SMS)
- Charts: Recharts

## 📦 Key Dependencies

### Backend
- express, mongoose, bcryptjs, jsonwebtoken
- nodemailer, twilio, cors, dotenv

### Frontend
- react, react-router-dom, axios
- recharts, react-toastify, react-icons

## 🔑 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gramsathi
JWT_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

## 📁 Project Structure

```
GramSathi/
├── backend/          # Node.js API
├── frontend/         # React App
├── README.md         # Main documentation
├── SETUP_GUIDE.md    # Detailed setup
├── TESTING_GUIDE.md  # Testing scenarios
└── install.bat       # Installation script
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB error | Start MongoDB: `mongod` |
| Port in use | Change PORT in .env |
| OTP not received | Check email spam, verify .env |
| 401 error | Logout and login again |

## 📞 Support Files

- SETUP_GUIDE.md - Complete installation guide
- TESTING_GUIDE.md - Test scenarios and sample data
- README.md - Project overview
