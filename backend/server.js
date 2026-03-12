require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware - CORS for both dev and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CLIENT_URL,          // Vercel production URL (set in .env / Render env)
].filter(Boolean);                  // remove undefined if CLIENT_URL not set

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const isVercel = /\.vercel\.app$/.test(origin);
    const isAllowedLocal = allowedOrigins.includes(origin);

    if (isAllowedLocal || isVercel) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Body:', JSON.stringify(req.body));
  }
  next();
});

// Routes
// Health check route for production diagnosis
app.get('/api/health-check', (req, res) => {
  const envStatus = {
    EMAIL_USER: !!process.env.EMAIL_USER,
    EMAIL_PASS: !!process.env.EMAIL_PASS,
    EMAIL_HOST: !!process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT || 'Not Set',
    REDIS_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    REDIS_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    MONGODB: !!process.env.MONGODB_URI,
    CLIENT_URL: process.env.CLIENT_URL || 'Not Set'
  };
  res.json({
    status: 'GramSathi API is running',
    environmentVariables: envStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/funds', require('./routes/fundRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'GramSathi API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled for all localhost origins`);
  console.log(`✅ Email service configured`);
  console.log(`✅ Body parser enabled\n`);
});
