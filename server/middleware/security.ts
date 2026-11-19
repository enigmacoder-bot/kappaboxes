import type { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config';
import { sessionsRepo } from '../db/client';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is in allowlist
    if (!origin || config.allowedOrigins.includes(origin) || !config.isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID'],
});

export const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // Vite frontend manages its own scripts/styles
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// IP-based Rate Limiter: 60 requests per 15 minutes
export const ipRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxIpRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

// Session-based Rate Limiter: max 25 messages per 15 minutes and 75 per day
export async function sessionRateLimiter(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.body?.sessionId || req.headers['x-session-id'];
  if (!sessionId || typeof sessionId !== 'string') {
    return next();
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const session = await sessionsRepo.getOrCreateSession(sessionId, clientIp);

  if (session.message_count >= config.rateLimit.dailySessionMax) {
    return res.status(429).json({
      error: 'Daily conversation limit reached for this session. Please contact our sales team directly via WhatsApp or email.',
    });
  }

  await sessionsRepo.incrementMessageCount(sessionId);
  next();
}

// Optional Cloudflare Turnstile verification
export async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  if (!config.turnstileSecretKey) {
    // If turnstile secret is not set, allow requests without blocking
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', config.turnstileSecretKey);
    formData.append('response', token);
    if (remoteIp) formData.append('remoteip', remoteIp);

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    const outcome = (await result.json()) as { success: boolean };
    return outcome.success;
  } catch (err) {
    console.error('[Security] Turnstile verification error:', err);
    return false;
  }
}
