# GramSathi - Deployment Checklist

## 📋 Pre-Deployment Checklist

### Backend Preparation

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Email service configured and tested
- [ ] SMS service configured (optional)
- [ ] JWT secret is strong and unique
- [ ] CORS configured for production domain
- [ ] Error handling tested
- [ ] API endpoints tested
- [ ] Database indexes created

### Frontend Preparation

- [ ] All dependencies installed (`npm install`)
- [ ] API base URL updated for production
- [ ] Build tested (`npm run build`)
- [ ] No console errors in production build
- [ ] Responsive design tested
- [ ] All routes working
- [ ] Authentication flow tested
- [ ] Charts rendering correctly

## 🚀 Deployment Steps

### Option 1: Deploy to Render (Backend) + Vercel (Frontend)

#### Step 1: Deploy Backend to Render

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: gramsathi-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: Free

3. **Add Environment Variables**
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<strong-secret-key>
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-app-password>
   TWILIO_ACCOUNT_SID=<your-sid>
   TWILIO_AUTH_TOKEN=<your-token>
   TWILIO_PHONE_NUMBER=<your-number>
   CLIENT_URL=<your-frontend-url>
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Note your backend URL: `https://gramsathi-backend.onrender.com`

#### Step 2: Setup MongoDB Atlas

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Choose region closest to your users

2. **Configure Access**
   - Database Access → Add Database User
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use this in `MONGODB_URI` environment variable

#### Step 3: Deploy Frontend to Vercel

1. **Update API Base URL**
   - Open `frontend/src/services/api.js`
   - Change baseURL to your Render backend URL:
   ```javascript
   const API = axios.create({
     baseURL: 'https://gramsathi-backend.onrender.com/api'
   });
   ```

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Create React App
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at: `https://gramsathi.vercel.app`

### Option 2: Deploy to AWS

#### Backend (EC2)

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (Free tier)
   - Configure security group (ports 22, 80, 443, 5000)

2. **Setup Server**
   ```bash
   # SSH into server
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod

   # Clone repository
   git clone <your-repo-url>
   cd GramSathi/backend

   # Install dependencies
   npm install

   # Setup environment
   nano .env
   # Add all environment variables

   # Install PM2
   sudo npm install -g pm2

   # Start application
   pm2 start server.js --name gramsathi-backend
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/gramsathi
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/gramsathi /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### Frontend (S3 + CloudFront)

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3
   - Create bucket with unique name
   - Enable static website hosting
   - Upload `build` folder contents

3. **Setup CloudFront**
   - Create CloudFront distribution
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → /index.html (for React Router)

## ✅ Post-Deployment Checklist

### Testing

- [ ] Backend health check: `https://your-backend-url/`
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] OTP emails are received
- [ ] Login works
- [ ] All pages load correctly
- [ ] API calls work
- [ ] Charts display correctly
- [ ] File uploads work (if implemented)
- [ ] Mobile responsive
- [ ] HTTPS enabled

### Security

- [ ] HTTPS enabled on both frontend and backend
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional)
- [ ] Input validation working
- [ ] SQL injection protection
- [ ] XSS protection

### Performance

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)
- [ ] Database queries optimized
- [ ] Indexes created

### Monitoring

- [ ] Error logging setup
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Database backup configured
- [ ] SSL certificate auto-renewal

## 🔧 Environment-Specific Configuration

### Development
```javascript
// frontend/src/services/api.js
baseURL: 'http://localhost:5000/api'
```

### Production
```javascript
// frontend/src/services/api.js
baseURL: 'https://your-backend-url.com/api'
```

## 📊 Monitoring Tools

### Free Options
- **Uptime Robot** - Uptime monitoring
- **LogRocket** - Frontend error tracking
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **MongoDB Atlas Monitoring** - Database monitoring

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📝 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (Namecheap, GoDaddy, etc.)

2. **Configure DNS**
   - A Record: `@` → Backend IP
   - CNAME: `www` → Frontend URL
   - CNAME: `api` → Backend URL

3. **SSL Certificate**
   - Use Let's Encrypt (free)
   - Or use Cloudflare (free SSL)

## 🎯 Launch Checklist

- [ ] All features tested in production
- [ ] Admin account created
- [ ] Sample data added
- [ ] User documentation ready
- [ ] Support email configured
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Team trained on system
- [ ] Launch announcement prepared

## 📞 Support & Maintenance

### Regular Tasks
- [ ] Weekly database backup
- [ ] Monthly security updates
- [ ] Quarterly performance review
- [ ] User feedback collection
- [ ] Bug fixes and improvements

### Emergency Contacts
- Database: MongoDB Atlas Support
- Hosting: Render/Vercel Support
- Email: Gmail Support
- SMS: Twilio Support

---

**Deployment Complete! 🚀**

Your GramSathi application is now live and serving villages!
