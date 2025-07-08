export const responseMiddleware = (req, res, next) => {
  res.success = ({ statusCode = 200, message = 'Success', data = null }) => {
    return res.status(statusCode).json({
      timestamp: new Date().toISOString(),
      success: true,
      message,
      data
    });
  };
  
  // Error response helper
  res.error = ({ statusCode = 400, message = 'Error', errors = null }) => {
    return res.status(statusCode).json({
      timestamp: new Date().toISOString(),
      success: false,
      message,
      errors
    });
  };
  
  next();
};
