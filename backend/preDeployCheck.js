/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║         GramSathi — Pre-Deployment Health Check          ║
 * ║  Run this before every deployment to catch errors early  ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 *  Usage:  node preDeployCheck.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

/* ─────────────── helpers ─────────────── */
const PASS = (msg) => console.log(`  ✅  ${msg}`);
const FAIL = (msg) => console.log(`  ❌  ${msg}`);
const WARN = (msg) => console.log(`  ⚠️   ${msg}`);
const SECTION = (title) => {
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`  🔍  ${title}`);
  console.log('─'.repeat(55));
};

let totalPass = 0;
let totalFail = 0;
let totalWarn = 0;

function pass(msg) { totalPass++; PASS(msg); }
function fail(msg) { totalFail++; FAIL(msg); }
function warn(msg) { totalWarn++; WARN(msg); }

/* ═══════════════════════════════════════════════════════════
   1. ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════ */
function checkEnvVars() {
  SECTION('Environment Variables');

  const required = [
    { key: 'PORT',                   label: 'Server Port' },
    { key: 'MONGODB_URI',            label: 'MongoDB URI' },
    { key: 'JWT_SECRET',             label: 'JWT Secret' },
    { key: 'EMAIL_HOST',             label: 'Email Host' },
    { key: 'EMAIL_PORT',             label: 'Email Port' },
    { key: 'EMAIL_USER',             label: 'Email User' },
    { key: 'EMAIL_PASS',             label: 'Email Password' },
    { key: 'UPSTASH_REDIS_REST_URL', label: 'Redis URL' },
    { key: 'UPSTASH_REDIS_REST_TOKEN', label: 'Redis Token' },
  ];

  const optional = [
    { key: 'WHATSAPP_TOKEN',       label: 'WhatsApp Token' },
    { key: 'PHONE_NUMBER_ID',      label: 'WhatsApp Phone ID' },
    { key: 'TWILIO_ACCOUNT_SID',   label: 'Twilio SID' },
    { key: 'TWILIO_AUTH_TOKEN',    label: 'Twilio Auth Token' },
    { key: 'TWILIO_PHONE_NUMBER',  label: 'Twilio Phone Number' },
    { key: 'CLIENT_URL',           label: 'Frontend URL' },
  ];

  for (const { key, label } of required) {
    const val = process.env[key];
    if (!val || val.startsWith('your_') || val.trim() === '') {
      fail(`${label} (${key}) is missing or still a placeholder`);
    } else {
      pass(`${label} (${key}) is set`);
    }
  }

  for (const { key, label } of optional) {
    const val = process.env[key];
    if (!val || val.startsWith('your_') || val.trim() === '') {
      warn(`${label} (${key}) not configured (optional)`);
    } else {
      pass(`${label} (${key}) is set`);
    }
  }

  // Specific value checks
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
    fail('JWT_SECRET is too short (use at least 32 chars for security)');
  }
  if (process.env.JWT_EXPIRE && !/^\d+[smhd]$/.test(process.env.JWT_EXPIRE)) {
    warn('JWT_EXPIRE format looks unusual (expected e.g. 7d, 24h, 3600s)');
  }
}

/* ═══════════════════════════════════════════════════════════
   2. MONGODB
═══════════════════════════════════════════════════════════ */
async function checkMongoDB() {
  SECTION('MongoDB Connection');
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 7000,
    });
    pass('Connected to MongoDB Atlas successfully');

    // Check all models can be loaded
    const models = [
      './models/User',
      './models/Complaint',
      './models/Event',
      './models/Fund',
      './models/Notification',
      './models/Project',
      './models/WelfareScheme',
    ];
    for (const m of models) {
      try {
        require(m);
        pass(`Model loaded: ${m.replace('./models/', '')}`);
      } catch (e) {
        fail(`Model failed to load: ${m} — ${e.message}`);
      }
    }

    await mongoose.connection.close();
  } catch (err) {
    fail(`MongoDB connection failed: ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════════
   3. REDIS (Upstash)
═══════════════════════════════════════════════════════════ */
async function checkRedis() {
  SECTION('Upstash Redis Connection');
  try {
    const { Redis } = require('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const testKey = 'gramsathi:precheck:test';
    await redis.set(testKey, 'ok', { ex: 30 });
    const val = await redis.get(testKey);
    if (val === 'ok') {
      pass('Redis SET/GET round-trip succeeded');
    } else {
      fail('Redis GET returned unexpected value');
    }
    await redis.del(testKey);
    pass('Redis DEL succeeded');
  } catch (err) {
    fail(`Redis check failed: ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════════
   4. EMAIL (SMTP)
═══════════════════════════════════════════════════════════ */
async function checkEmail() {
  SECTION('Email / SMTP');
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();
    pass(`SMTP connected to ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
    pass(`Authenticated as ${process.env.EMAIL_USER}`);
  } catch (err) {
    fail(`Email SMTP check failed: ${err.message}`);
    warn('Fix: Make sure EMAIL_PASS is a Gmail App Password (not your real password)');
  }
}

/* ═══════════════════════════════════════════════════════════
   5. JWT
═══════════════════════════════════════════════════════════ */
function checkJWT() {
  SECTION('JWT (JSON Web Token)');
  try {
    const payload = { id: 'test-user-123', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1m' });
    pass('JWT token signed successfully');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id === payload.id && decoded.role === payload.role) {
      pass('JWT token verified and payload matches');
    } else {
      fail('JWT token verified but payload mismatch');
    }
  } catch (err) {
    fail(`JWT check failed: ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════════
   6. ROUTE & CONTROLLER FILE INTEGRITY
═══════════════════════════════════════════════════════════ */
function checkRoutes() {
  SECTION('Routes & Controllers File Integrity');

  // NOTE: server.js is intentionally excluded — requiring it starts Express
  // and would cause EADDRINUSE if the server is already running.
  const files = [
    './config/db.js',
    './routes/authRoutes.js',
    './routes/complaintRoutes.js',
    './routes/eventRoutes.js',
    './routes/fundRoutes.js',
    './routes/notificationRoutes.js',
    './routes/projectRoutes.js',
    './routes/schemeRoutes.js',
    './controllers/authController.js',
    './controllers/complaintController.js',
    './controllers/eventController.js',
    './controllers/fundController.js',
    './controllers/notificationController.js',
    './controllers/projectController.js',
    './controllers/schemeController.js',
    './services/emailService.js',
    './middleware/auth.js',
    './middleware/rateLimit.js',
  ];

  for (const f of files) {
    try {
      require(f);
      pass(`Loaded OK: ${f}`);
    } catch (e) {
      fail(`Syntax/import error in ${f}: ${e.message}`);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   7. PORT SANITY
═══════════════════════════════════════════════════════════ */
function checkPort() {
  SECTION('Port Configuration');
  const port = parseInt(process.env.PORT);
  if (!port || isNaN(port)) {
    fail('PORT is not a valid number');
  } else if (port < 1024) {
    warn(`PORT ${port} is a privileged port (<1024); needs root on Linux`);
  } else {
    pass(`PORT is ${port} (valid)`);
  }

  const clientUrl = process.env.CLIENT_URL || '';
  if (clientUrl.includes('localhost')) {
    warn(`CLIENT_URL is still localhost (${clientUrl}) — update for production`);
  } else if (clientUrl) {
    pass(`CLIENT_URL set to: ${clientUrl}`);
  }
}

/* ═══════════════════════════════════════════════════════════
   8. NODE / PACKAGE SANITY
═══════════════════════════════════════════════════════════ */
function checkNode() {
  SECTION('Node.js & Packages');
  const [major] = process.version.replace('v', '').split('.').map(Number);
  if (major >= 16) {
    pass(`Node.js version: ${process.version} (supported)`);
  } else {
    fail(`Node.js ${process.version} is too old — need v16+ for production`);
  }

  const deps = [
    'express', 'mongoose', 'jsonwebtoken', 'bcryptjs',
    'cors', 'dotenv', 'nodemailer', '@upstash/redis',
    'express-validator', 'multer',
  ];
  for (const dep of deps) {
    try {
      require(dep);
      pass(`Package present: ${dep}`);
    } catch {
      fail(`Package missing: ${dep} — run npm install`);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   SUMMARY
═══════════════════════════════════════════════════════════ */
function printSummary() {
  console.log(`\n${'═'.repeat(55)}`);
  console.log('  📊  PRE-DEPLOYMENT CHECK SUMMARY');
  console.log('═'.repeat(55));
  console.log(`  ✅  Passed  : ${totalPass}`);
  console.log(`  ❌  Failed  : ${totalFail}`);
  console.log(`  ⚠️   Warnings: ${totalWarn}`);
  console.log('═'.repeat(55));

  if (totalFail === 0 && totalWarn === 0) {
    console.log('\n  🚀  ALL CHECKS PASSED — Safe to deploy!\n');
  } else if (totalFail === 0) {
    console.log('\n  🟡  No failures but there are warnings — review before deploy.\n');
  } else {
    console.log(`\n  🚫  ${totalFail} check(s) FAILED — fix before deploying!\n`);
    process.exitCode = 1;
  }
}

/* ═══════════════════════════════════════════════════════════
   MAIN — run all checks
═══════════════════════════════════════════════════════════ */
(async () => {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║     GramSathi — Pre-Deployment Health Check          ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log('  Checking all systems before deployment...');

  checkEnvVars();
  checkNode();
  checkJWT();
  checkRoutes();
  checkPort();

  // async checks
  await checkMongoDB();
  await checkRedis();
  await checkEmail();

  printSummary();
  process.exit(process.exitCode || 0);
})();
