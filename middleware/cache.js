const { getRedisClient } = require('../config/redis');

const cache = (duration) => {
  return async (req, res, next) => {
    const redisClient = getRedisClient();
    
    if (!redisClient) {
      return next();
    }

    try {
      // Create a unique key based on the route and query parameters
      const key = `api:${req.originalUrl}`;
      
      // Check if the data exists in cache
      const cachedData = await redisClient.get(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Modify res.json to store the response in cache before sending
      const originalJson = res.json;
      res.json = function(data) {
        // Store the response in Redis with expiration
        redisClient.setEx(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

const clearCache = async (pattern) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Clear cache error:', error);
  }
};

module.exports = { cache, clearCache };