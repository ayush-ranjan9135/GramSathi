# GramSathi - Testing Guide

## 🧪 Quick Start Testing

### Step 1: Start the Application

1. Ensure MongoDB is running
2. Run `start.bat` to start both servers
3. Wait for both servers to start (Backend: port 5000, Frontend: port 3000)

### Step 2: Create Test Users

#### Test User 1: Villager Account
```
Name: Ramesh Kumar
Email: ramesh@test.com
Phone: +919876543210
Password: Test@123
Role: Villager
Village: Rampur
Address: Main Street, Rampur
```

#### Test User 2: Admin Account
```
Name: Sarpanch Sharma
Email: admin@test.com
Phone: +919876543211
Password: Admin@123
Role: Panchayat Admin
Village: Rampur
Address: Panchayat Office, Rampur
```

#### Test User 3: Worker Account
```
Name: Mohan Worker
Email: worker@test.com
Phone: +919876543212
Password: Worker@123
Role: Worker
Village: Rampur
Address: Worker Colony, Rampur
```

## 📋 Test Scenarios

### Scenario 1: User Registration & Login

**Test Case 1.1: Register as Villager**
1. Go to http://localhost:3000/register
2. Fill in the registration form with Test User 1 details
3. Click "Register"
4. Check your email for OTP
5. Enter OTP and verify
6. Expected: Account created successfully, redirected to login

**Test Case 1.2: Login**
1. Go to http://localhost:3000/login
2. Enter phone: +919876543210
3. Enter password: Test@123
4. Click "Login"
5. Expected: Logged in successfully, redirected to dashboard

**Test Case 1.3: Forgot Password**
1. Go to http://localhost:3000/login
2. Click "Forgot Password?"
3. Enter phone number
4. Receive OTP via email/SMS
5. Enter OTP and new password
6. Expected: Password reset successful

### Scenario 2: Complaint Management (Villager)

**Test Case 2.1: Submit Complaint**
1. Login as Villager (Test User 1)
2. Go to "Complaints" page
3. Click "New Complaint"
4. Fill in:
   - Title: "Water Supply Issue in Main Street"
   - Description: "No water supply for the last 3 days in Main Street area"
   - Category: Water
   - Priority: High
5. Click "Submit"
6. Expected: Complaint submitted successfully

**Test Case 2.2: View Complaint Status**
1. Stay on Complaints page
2. View the submitted complaint
3. Check status (should be "Pending")
4. Expected: Complaint visible with all details

### Scenario 3: Project Management (Admin)

**Test Case 3.1: Create Project**
1. Login as Admin (Test User 2)
2. Go to "Projects" page
3. Click "Create Project" (if button exists)
4. Fill in project details:
   - Name: "Main Road Repair"
   - Description: "Repair of 2km main road from village entrance"
   - Category: Road
   - Budget: 500000
   - Start Date: Today
   - End Date: 30 days from today
   - Status: Ongoing
   - Progress: 25
   - Contractor: "ABC Construction"
5. Expected: Project created successfully

**Test Case 3.2: View Projects**
1. Stay on Projects page
2. View all projects
3. Check progress bars
4. Expected: All projects visible with progress indicators

### Scenario 4: Fund Management (Admin)

**Test Case 4.1: Add Fund Entry**
1. Login as Admin
2. Go to "Funds" page
3. Click "Add Fund Entry"
4. Fill in:
   - Scheme Name: "MGNREGA 2024"
   - Amount: 1000000
   - Category: Infrastructure
   - Source: Central
   - Description: "Rural employment scheme funds"
5. Click "Add Entry"
6. Expected: Fund entry added successfully

**Test Case 4.2: View Budget Transparency**
1. Stay on Funds page
2. View statistics cards (Total Received, Total Spent, Balance)
3. View pie chart (Category-wise distribution)
4. View bar chart (Source-wise funds)
5. View fund entries table
6. Expected: All data displayed correctly with charts

### Scenario 5: Event Management (Admin)

**Test Case 5.1: Create Event**
1. Login as Admin
2. Go to "Events" page
3. Click "Create Event"
4. Fill in:
   - Title: "Gram Sabha Meeting"
   - Description: "Monthly village meeting to discuss development works"
   - Date: Next week
   - Time: 10:00 AM
   - Location: Panchayat Office
   - Type: Meeting
5. Click "Create Event"
6. Expected: Event created successfully

**Test Case 5.2: View Events**
1. Stay on Events page
2. View all events
3. Check upcoming events (highlighted)
4. Expected: Events displayed with date, time, location

### Scenario 6: Welfare Schemes (Admin)

**Test Case 6.1: Add Welfare Scheme**
1. Login as Admin
2. Go to "Schemes" page
3. Click "Add Scheme"
4. Fill in:
   - Name: "PM Awas Yojana"
   - Description: "Housing scheme for rural poor"
   - Category: Housing
   - Eligibility: 
     ```
     Annual income below 3 lakhs
     No pucca house owned
     BPL card holder
     ```
   - Documents:
     ```
     Aadhar Card
     Income Certificate
     BPL Card
     Bank Account Details
     ```
   - Benefits:
     ```
     Financial assistance up to 1.2 lakhs
     Technical support for construction
     Quality monitoring
     ```
   - Apply Link: https://pmayg.nic.in/
5. Click "Add Scheme"
6. Expected: Scheme added successfully

**Test Case 6.2: View Schemes (Villager)**
1. Login as Villager
2. Go to "Schemes" page
3. Browse all schemes
4. Check eligibility criteria
5. View required documents
6. Click "Apply Now" link
7. Expected: All scheme details visible, external link opens

### Scenario 7: Dashboard Analytics (Admin)

**Test Case 7.1: View Dashboard**
1. Login as Admin
2. Go to "Dashboard"
3. View statistics cards:
   - Total Projects
   - Completed Projects
   - Budget Balance
4. View charts:
   - Complaints by Category (Pie Chart)
   - Fund Distribution (Bar Chart)
5. View upcoming events
6. Expected: All data displayed with visual charts

### Scenario 8: Role-Based Access

**Test Case 8.1: Villager Access**
1. Login as Villager
2. Try to access all pages
3. Expected: Can view all pages but cannot create/edit projects, funds, events, schemes

**Test Case 8.2: Admin Access**
1. Login as Admin
2. Try to access all pages
3. Expected: Can create, edit, delete all resources

## 🎯 Sample Data for Testing

### Sample Complaints
```
1. Water Supply Issue - Main Street - High Priority
2. Street Light Not Working - Park Road - Medium Priority
3. Road Damage - Village Entrance - High Priority
4. Drainage Blockage - Market Area - Medium Priority
5. Electricity Fluctuation - Residential Area - Low Priority
```

### Sample Projects
```
1. Main Road Repair - Budget: ₹5,00,000 - Progress: 25%
2. Community Hall Construction - Budget: ₹10,00,000 - Progress: 60%
3. Water Tank Installation - Budget: ₹3,00,000 - Progress: 100%
4. Street Light Installation - Budget: ₹2,00,000 - Progress: 40%
5. Drainage System Upgrade - Budget: ₹7,00,000 - Progress: 15%
```

### Sample Fund Entries
```
1. MGNREGA 2024 - ₹10,00,000 - Infrastructure - Central
2. Swachh Bharat Mission - ₹5,00,000 - Sanitation - Central
3. State Education Fund - ₹3,00,000 - Education - State
4. Agriculture Subsidy - ₹4,00,000 - Agriculture - State
5. Health Camp Fund - ₹2,00,000 - Healthcare - Government
```

### Sample Events
```
1. Gram Sabha Meeting - Next Monday 10:00 AM - Panchayat Office
2. Health Camp - Next Wednesday 9:00 AM - Primary School
3. Vaccination Drive - Next Friday 8:00 AM - Community Center
4. Cultural Program - Next Saturday 6:00 PM - Village Ground
5. Farmers Meeting - Next Sunday 10:00 AM - Panchayat Office
```

### Sample Welfare Schemes
```
1. PM Awas Yojana - Housing - Central Government
2. Old Age Pension - Pension - State Government
3. Scholarship for Girls - Education - State Government
4. Kisan Samman Nidhi - Agriculture - Central Government
5. Ayushman Bharat - Healthcare - Central Government
```

## ✅ Checklist

### Frontend Testing
- [ ] Registration with OTP works
- [ ] Login works
- [ ] Forgot password works
- [ ] Dashboard displays correctly
- [ ] Complaints can be submitted
- [ ] Projects are visible
- [ ] Funds page shows charts
- [ ] Events are displayed
- [ ] Schemes are visible
- [ ] Navbar navigation works
- [ ] Logout works
- [ ] Responsive design works on mobile

### Backend Testing
- [ ] MongoDB connection successful
- [ ] User registration API works
- [ ] OTP generation and verification works
- [ ] JWT authentication works
- [ ] All CRUD operations work
- [ ] Role-based authorization works
- [ ] Email notifications work
- [ ] Data aggregation for stats works

### Security Testing
- [ ] Passwords are hashed
- [ ] JWT tokens expire correctly
- [ ] Protected routes require authentication
- [ ] Role-based access control works
- [ ] OTP expires after 10 minutes
- [ ] Input validation works

## 🐛 Common Test Issues

### Issue 1: OTP Not Received
- Check email spam folder
- Verify EMAIL_USER and EMAIL_PASS in .env
- Ensure Gmail App Password is used
- Check console for errors

### Issue 2: Charts Not Displaying
- Ensure there is data in the database
- Check browser console for errors
- Verify recharts is installed

### Issue 3: 401 Unauthorized Error
- Token might be expired, logout and login again
- Check if JWT_SECRET is set correctly
- Verify token is being sent in headers

## 📊 Expected Results

After completing all test scenarios, you should have:

- ✅ 3 registered users (Villager, Admin, Worker)
- ✅ 5+ complaints in the system
- ✅ 5+ projects with progress tracking
- ✅ 5+ fund entries with charts
- ✅ 5+ upcoming events
- ✅ 5+ welfare schemes
- ✅ Working dashboard with analytics
- ✅ All CRUD operations functional
- ✅ Role-based access working

## 🎓 Advanced Testing

### Load Testing
- Create 50+ complaints
- Create 20+ projects
- Add 30+ fund entries
- Test dashboard performance

### Mobile Testing
- Test on mobile browsers
- Check responsive design
- Test touch interactions

### Browser Compatibility
- Test on Chrome
- Test on Firefox
- Test on Edge
- Test on Safari (if available)

---

**Happy Testing! 🚀**

For issues, refer to SETUP_GUIDE.md or contact the development team.
