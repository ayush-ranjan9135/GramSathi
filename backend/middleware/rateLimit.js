import cacheService from '../services/cacheService.js';

export const rateLimiter = (limit = 100, window = 60) => {
  return async (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const key = `api:${req.path}:${identifier}`;
    
    const canProceed = await cacheService.checkRateLimit(key, limit, window);
    
    if (!canProceed) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }
    
    next();
  };
};
