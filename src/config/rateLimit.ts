import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: 'We received too many requests from this IP address. Please try again in 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: {
    status: 429,
    message: 'Too many login attempts from this IP address. Please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});