import { User } from '../models/user.model.js';
import { getCache, setCache } from '../utils/redis.util.js';


export class UserController {


    listUsers = async (req, res) => {
        try {
          const cacheKey = 'users:list';
          
          const cachedUsers = await getCache(cacheKey);
          
          if (cachedUsers) {
            return res.success({
              message: 'Users retrieved successfully (from cache)',
              data: cachedUsers
            });
          }
          
          const users = await User.find({}, '-password');
          
          await setCache(cacheKey, users, 300);
          
          res.success({
            message: 'Users retrieved successfully',
            data: users
          });
        } catch (error) {
          res.error({
            statusCode: 500,
            message: 'Failed to retrieve users',
            errors: error
          });
        }
      };

    updateUser = async (req, res) => {
        try {
          const { id } = req.params;
          const { name, lastName, email, isActive } = req.body;
          
          const userExists = await User.findById(id);
          if (!userExists) {
            res.error({
              statusCode: 404,
              message: 'User not found'
            });
            return;
          }
          
          if (email && email !== userExists.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
              res.error({
                statusCode: 400,
                message: 'Email already in use'
              });
              return;
            }
          }
          
          const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, lastName, email, isActive },
            { new: true, runValidators: true }
          ).select('-password');
          
          res.success({
            message: 'User updated successfully',
            data: updatedUser
          });
        } catch (error) {
          res.error({
            statusCode: 500,
            message: 'Failed to update user',
            errors: error
          });
        }
      };
}

