import rateLimit from "express-rate-limit";

const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
});

export  {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
};
