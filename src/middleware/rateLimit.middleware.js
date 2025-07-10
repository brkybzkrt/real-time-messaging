import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, 
  message: {
    timestamp: new Date().toISOString(),
    success: false,
    message: 'Too many requests, please try again later.',
    errors: { error: 'Rate limit exceeded' }
  }
});


export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 login requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    timestamp: new Date().toISOString(),
    success: false,
    message: 'Too many login attempts, please try again later.',
    errors: { error: 'Rate limit exceeded' }
  }
});

