import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { UserRole } from '../types/index.js';

// Middleware to authenticate user using JWT
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.error({
        statusCode: 401,
        message: 'Authentication failed: No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id, '-password -__v');
    
    if (!user) {
      return res.error({
        statusCode: 401,
        message: 'Authentication failed: User not found'
      });
    }
    
    if (!user.isActive) {
      return res.error({
        statusCode: 403,
        message: 'Authentication failed: Account is deactivated'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.error({
        statusCode: 401,
        message: 'Authentication failed: Token expired'
      });
    }
    
    return res.error({
      statusCode: 401,
      message: 'Authentication failed: Invalid token'
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== UserRole.ADMIN) {
    return res.error({
      statusCode: 403,
      message: 'Access denied: Admin privileges required'
    });
  }
  
  next();
};
