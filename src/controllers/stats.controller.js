import redisClient from '../utils/redis.util.js';

export const getOnlineCount = async (req, res) => {
  try {
    const count = await redisClient.sCard('onlineUsers');
    res.success({ data: count });
  } catch (error) {
    res.error({ errors: error });
  }
};

export const getOnlineUsers = async (req, res) => {
    try {
      const users = await redisClient.sMembers('onlineUsers');
      res.success({ data: users });
    } catch (error) {
      res.error({ errors: error });
    }
  };


export const getSpesificUserWithOnlineStatus = async (req, res) => {
    try {
      const { userId } = req.params;
      const online = await redisClient.sIsMember('onlineUsers', userId);
      res.success({ message: online ? 'User is online' : 'User is offline' });
    } catch (error) {
      res.error({ errors: error });
    }
  };