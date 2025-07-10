import { User } from '../models/user.model.js';
import { generateToken, verifyRefreshToken } from '../utils/jwt.util.js';

export class AuthController {
    
  register = async (req, res) => {
    try {
      const { name, lastName, email, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.error({
          statusCode: 400,
          message: 'Registration failed: Email already in use'
        });
        return;
      }
      
      const user = await User.create({
        name,
        lastName,
        email,
        password
      });
      
      const tokens = generateToken(user);
      
      res
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
        })
        .success({
          message: 'User registered successfully',
          data: {
            token: tokens.accessToken,
            user: {
              id: user._id,
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            }
          }
        });
    } catch (error) {
      res.error({
        statusCode: 500,
        message: 'Registration failed: Server error',
        errors: error
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.error({
          statusCode: 400,
          message: 'Login failed: Email and password are required'
        });
        return;
      }
      
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        res.error({
          statusCode: 401,
          message: 'Login failed: Invalid credentials'
        });
        return;
      }
      
      if (!user.isActive) {
        res.error({
          statusCode: 403,
          message: 'Login failed: Account is deactivated'
        });
        return;
      }
      
      // Check if password is correct
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.error({
          statusCode: 401,
          message: 'Login failed: Invalid credentials'
        });
        return;
      }
      
      const tokens = generateToken(user);
      
      user.lastLogin = new Date();
      await user.save();
      
      res
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .success({
          message: 'Login successful',
          data: {
            token: tokens.accessToken,
            user: {
              id: user._id,
              name: user.name,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            }
          }
  });
    } catch (error) {
      res.error({
        statusCode: 500,
        message: 'Login failed: Server error',
        errors: error
      });
    }
  };

  getProfile = async (req, res) => {
    try {
      res.success({
        message: 'Profile retrieved successfully',
        data: req.user
      });
    } catch (error) {
      res.error({
        statusCode: 500,
        message: 'Failed to retrieve profile',
        errors: error
      });
    }
  };



  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;
      
      if (!currentPassword || !newPassword) {
        res.error({
          statusCode: 400,
          message: 'Password change failed: Current and new passwords are required'
        });
        return;
      }
      
      // Find user with password
      const user = await User.findById(userId).select('+password');
      if (!user) {
        res.error({
          statusCode: 404,
          message: 'Password change failed: User not found'
        });
        return;
      }
      
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        res.error({
          statusCode: 401,
          message: 'Password change failed: Current password is incorrect'
        });
        return;
      }
      
    
      user.password = newPassword;
      await user.save();
      
      res.success({
        message: 'Password changed successfully'
      });
    } catch (error) {
      res.error({
        statusCode: 500,
        message: 'Password change failed: Server error',
        errors: error
      });
    }
  };

  refresh = async (req, res) => {
    try {
      debugger;
      let token = req?.cookies?.refreshToken;
  
      if (!token) {
        return res.error({
          statusCode: 400,
          message: 'Refresh failed: No refresh token in cookies'
        });
      }
  
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id);
  
      if (!user || !user.isActive) {
        return res.error({
          statusCode: 403,
          message: 'Refresh failed: Unauthorized'
        });
      }
  
      const tokens = generateToken(user);
  
      res
        .success({
          message: 'Token refreshed successfully',
          data: {
            token: tokens.accessToken
          }
        });
  
    } catch (error) {
      return res.error({
        statusCode: 401,
        message: 'Refresh failed',
        errors: error
      });
    }
  };
  
  logout = async (req, res) => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
  
      res.success({
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.error({
        statusCode: 500,
        message: 'Logout failed: Server error',
        errors: error
      });
    }
  };

 
}
