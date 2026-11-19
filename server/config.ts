import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // AI Configuration
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
  maxAiTokens: parseInt(process.env.MAX_AI_TOKENS || '350', 10),
  maxHistoryTurns: parseInt(process.env.MAX_HISTORY_TURNS || '10', 10),
  maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '1000', 10),

  // Company Information
  companyName: process.env.COMPANY_NAME || 'KappaBoxes',
  companyWhatsAppNumber: (process.env.COMPANY_WHATSAPP_NUMBER || '918867719798').replace(/[^0-9]/g, ''),
  salesEmail: process.env.SALES_EMAIL || 'info@kappaboxes.com',
  salesPhone: process.env.SALES_PHONE || '+91 8867719798',

  // Database (Supabase)
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',

  // Cloudflare Turnstile (Optional)
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxIpRequests: parseInt(process.env.RATE_LIMIT_IP_MAX || '60', 10),
    maxSessionMessages: parseInt(process.env.RATE_LIMIT_SESSION_MAX || '25', 10),
    dailySessionMax: parseInt(process.env.RATE_LIMIT_SESSION_DAILY_MAX || '75', 10),
  },

  // CORS
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ||
    'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,https://kappaboxes-nu.vercel.app,https://kappaboxes.vercel.app'
  )
    .split(',')
    .map((s) => s.trim().replace(/\/$/, '')),
};
