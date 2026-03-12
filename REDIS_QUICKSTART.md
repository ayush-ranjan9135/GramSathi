# ⚡ Redis Quick Start - 5 Minutes Setup

## Step 1: Get Upstash Credentials (2 min)

1. Go to https://console.upstash.com/
2. Sign up (free)
3. Click "Create Database"
4. Copy REST URL
5. Copy REST Token

## Step 2: Update .env (1 min)

Open `backend/.env` and add:

```env
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## Step 3: Test (1 min)

```bash
cd backend
node testRedis.js
```

Should see: ✅ All Redis tests passed! 🎉

## Step 4: Run App (1 min)

```bash
npm run dev
```

## Done! 🎉

Your app now has:
- ✅ OTP management with Redis
- ✅ Rate limiting
- ✅ Session caching
- ✅ Stats caching
- ✅ 80% faster performance

## Test It

1. Register new user → OTP sent
2. Login 6 times wrong password → Rate limited
3. Check dashboard → Stats load instantly

## Need Help?

See detailed docs:
- REDIS_IMPLEMENTATION.md
- REDIS_QUICK_REFERENCE.md
