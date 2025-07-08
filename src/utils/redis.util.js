import { createClient } from 'redis';

// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.connect().catch(err => {
  console.error('Redis connection error:', err);
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Handle Redis connection
redisClient.on('connect', () => {
  console.log('Redis connected successfully');
});


export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};


export const setCache = async (key, data, expiry = 3600) => {
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
};

export default redisClient;
