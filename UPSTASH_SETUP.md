# Upstash Redis Setup Guide

## 1. Create Upstash Account
1. Go to https://upstash.com/
2. Sign up with GitHub/Google
3. Create new account

## 2. Create Redis Database
1. Click **"Create Database"**
2. Choose **"Global"** for better performance
3. Enter name: `gramsathi-cache`
4. Click **"Create"**

## 3. Get Connection Details
1. In database dashboard, go to **"Details"** tab
2. Copy **"REST URL"** 
3. Copy **"REST Token"**

## 4. Add to Environment Variables
Add to your `.env` file:
```env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## 5. Cached Data in GramSathi

### Stats Cached (5-15 minutes):
- **Complaint Stats** - Category & status counts
- **Project Stats** - Total, completed, ongoing counts  
- **Fund Stats** - Total received, spent, balance
- **Dashboard Stats** - Combined overview data

### Cache Keys:
- `gramsathi:stats:complaints`
- `gramsathi:stats:projects` 
- `gramsathi:stats:funds`
- `gramsathi:dashboard:all`
- `gramsathi:events:upcoming`

### Auto Cache Clearing:
- New complaint → Clear complaint & dashboard cache
- Project update → Clear project & dashboard cache
- Fund entry → Clear fund & dashboard cache

## 6. Benefits
- ⚡ **Faster API responses** (cached data loads instantly)
- 🔄 **Reduced database load** (fewer MongoDB queries)
- 💰 **Cost savings** (less database usage)
- 📊 **Better user experience** (instant dashboard loading)

## 7. Testing
1. Start server with Redis credentials
2. Visit dashboard → First load queries DB + caches result
3. Refresh dashboard → Loads from cache (faster)
4. Add new complaint → Cache auto-clears
5. Dashboard loads fresh data + caches again