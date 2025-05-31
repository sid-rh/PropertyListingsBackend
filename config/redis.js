const redis = require('redis');

let redisClient;

const redis_username=process.env.REDIS_USERNAME;
const redis_password=process.env.REDIS_PASSWORD;
const redis_host=process.env.REDIS_HOST;
const redis_port=process.env.REDIS_PORT;

const setupRedis= async()=>{
    try {
        redisClient = redis.createClient({
            username: redis_username,
            password: redis_password,
            socket: {
                host: redis_host,
                port: redis_port
            } 
        });

        redisClient.on('error', (error) => {
            console.error(`Redis Error: ${error}`);
        });

        await redisClient.connect();
        console.log('Redis client connected');
    } catch (error) {
        console.error(`Error connecting to Redis: ${error.message}`);
    }
}



const getRedisClient = () => {
  return redisClient;
};

module.exports = {
  setupRedis,
  getRedisClient
};

