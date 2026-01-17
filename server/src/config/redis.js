import { createClient } from 'redis';
import { error as _error, info } from '../utils/logger';

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB) || 0,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            _error('Redis max retries exceeded');
            return new Error('Redis max retries exceeded');
          }
          return retries * 50;
        }
      }
    });

    redisClient.on('error', (err) => _error('Redis Client Error', err));
    redisClient.on('connect', () => info('Redis connected successfully'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    _error('Redis connection failed:', error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    info('Redis connection closed');
  }
};

export default {
  connectRedis,
  getRedisClient,
  disconnectRedis
};
