import { verifyRefreshToken } from '../utils/jwt.util.js';   // Express’te kullandığımız fonksiyon
import { User } from '../models/user.model.js';

export const authenticate = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token ||
                  socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) return next(new Error('AUTH_MISSING_TOKEN'));

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('AUTH_USER_NOT_FOUND'));

    // Add user to socket object
    socket.user = user;
    next();
  } catch {
    next(new Error('AUTH_INVALID_TOKEN'));
  }
};
