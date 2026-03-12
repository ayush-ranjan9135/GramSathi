import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cacheService from '../services/cacheService.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to get user from cache first
    let user = await cacheService.getCachedUser(decoded.id);
    
    if (!user) {
      // If not in cache, fetch from DB and cache it
      user = await User.findById(decoded.id).select('-password');
      if (user) {
        await cacheService.cacheUser(decoded.id, {
          id: user._id,
          name: user.name,
          role: user.role,
          phone: user.phone
        });
      }
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
