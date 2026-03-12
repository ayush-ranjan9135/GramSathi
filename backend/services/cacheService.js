import { Redis } from '@upstash/redis';

class CacheService {
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    this.defaultTTL = 300; // 5 minutes
  }

  // Generate cache key
  generateKey(prefix, ...params) {
    return `gramsathi:${prefix}:${params.join(':')}`;
  }

  // Get cached data
  async get(key) {
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cache data
  async set(key, data, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cache
  async del(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear pattern-based cache
  async clearPattern(pattern) {
    try {
      const keys = await this.redis.keys(`gramsathi:${pattern}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache clear pattern error:', error);
      return false;
    }
  }

  // Store OTP
  async setOTP(phone, otp, ttl = 300) {
    const key = this.generateKey('otp', phone);
    return await this.set(key, { otp, createdAt: Date.now() }, ttl);
  }

  // Get OTP
  async getOTP(phone) {
    const key = this.generateKey('otp', phone);
    return await this.get(key);
  }

  // Delete OTP
  async deleteOTP(phone) {
    const key = this.generateKey('otp', phone);
    return await this.del(key);
  }

  // Rate limiting
  async checkRateLimit(identifier, limit = 5, window = 300) {
    const key = this.generateKey('ratelimit', identifier);
    try {
      const count = await this.redis.incr(key);
      if (count === 1) {
        await this.redis.expire(key, window);
      }
      return count <= limit;
    } catch (error) {
      console.error('Rate limit error:', error);
      return true;
    }
  }

  // Cache user session
  async cacheUser(userId, userData, ttl = 3600) {
    const key = this.generateKey('user', userId);
    return await this.set(key, userData, ttl);
  }

  // Get cached user
  async getCachedUser(userId) {
    const key = this.generateKey('user', userId);
    return await this.get(key);
  }

  // Cache keys for different stats
  keys = {
    complaintStats: () => this.generateKey('stats', 'complaints'),
    projectStats: () => this.generateKey('stats', 'projects'),
    fundStats: () => this.generateKey('stats', 'funds'),
    dashboardStats: (userId) => this.generateKey('dashboard', userId || 'all'),
    upcomingEvents: () => this.generateKey('events', 'upcoming'),
    recentComplaints: () => this.generateKey('complaints', 'recent'),
  };
}

export default new CacheService();