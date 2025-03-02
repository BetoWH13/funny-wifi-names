// Rate limiting utility for Netlify Functions
const rateLimit = require('express-rate-limit');
const redis = require('redis');

// In-memory storage for rate limiting (fallback if Redis is not available)
const inMemoryStore = new Map();

// Create Redis client if needed for production
let redisClient = null;
let redisStore = null;

// Setup Redis client for production environment
if (process.env.REDIS_URL) {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis Error:', err);
    });
    
    // Connect to Redis
    redisClient.connect().catch(err => {
      console.error('Redis connection error:', err);
    });
    
    // Redis store for rate limiting
    redisStore = {
      increment: async (key) => {
        const count = await redisClient.incr(key);
        if (count === 1) {
          await redisClient.expire(key, 24 * 60 * 60); // 24 hours in seconds
        }
        return count;
      },
      decrement: async (key) => {
        return await redisClient.decr(key);
      },
      resetKey: async (key) => {
        return await redisClient.del(key);
      }
    };
  } catch (error) {
    console.error('Redis setup error:', error);
  }
}

// Simple in-memory store for development
const memoryStore = {
  increment: async (key) => {
    const current = inMemoryStore.get(key) || 0;
    inMemoryStore.set(key, current + 1);
    return current + 1;
  },
  decrement: async (key) => {
    const current = inMemoryStore.get(key) || 0;
    const newValue = Math.max(0, current - 1);
    inMemoryStore.set(key, newValue);
    return newValue;
  },
  resetKey: async (key) => {
    inMemoryStore.delete(key);
    return true;
  }
};

// Choose the appropriate store
const store = redisStore || memoryStore;

// Rate limit middleware for Netlify Functions
const rateLimitMiddleware = async (event) => {
  const ip = event.headers['client-ip'] || 
             event.headers['x-forwarded-for'] || 
             event.headers['x-nf-client-connection-ip'] || 
             'unknown-ip';
  
  const key = `ratelimit:${ip}`;
  const windowMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const maxRequests = 10; // Free users get 10 requests per day
  
  try {
    const requestCount = await store.increment(key);
    
    // Check if rate limit is exceeded
    if (requestCount > maxRequests) {
      return {
        statusCode: 429,
        body: JSON.stringify({ 
          error: "Rate limit exceeded. Upgrade for more access!" 
        })
      };
    }
    
    // Continue with the request
    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return null; // Allow the request to proceed if rate limiting fails
  }
};

module.exports = {
  rateLimitMiddleware
};
