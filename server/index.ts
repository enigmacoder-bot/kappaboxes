import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { corsMiddleware, helmetMiddleware, ipRateLimiter } from './middleware/security';
import { apiRouter } from './routes/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Trust reverse proxy (Vercel, Cloudflare, AWS ALB) for accurate IP detection in rate limiting
app.set('trust proxy', 1);

// 1. Basic security & headers
app.use(helmetMiddleware);
app.use(corsMiddleware);

// 2. Request parsing with body size restriction
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 3. Global IP rate limiting for API routes
app.use('/api', ipRateLimiter);

// 4. Mount API Router (supports both direct /api prefix and serverless environments where /api may be stripped)
app.use('/api', apiRouter);
app.use(apiRouter);

// 5. In production environments outside Vercel (e.g. self-hosted Node/Docker), serve Vite build output
if (config.isProduction && !process.env.VERCEL) {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// 6. Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Unhandled Server Error]:', err.message || err);
  res.status(500).json({
    error: 'An unexpected server error occurred.',
  });
});

// Start listener only when run directly as main entry point (not when imported in tests)
const isDirectRun =
  Boolean(process.argv[1]) &&
  !process.argv.includes('--test') &&
  (process.argv[1].endsWith('server/index.ts') ||
    process.argv[1].endsWith('server\\index.ts') ||
    process.argv[1].endsWith('server/index.js') ||
    process.argv[1].endsWith('server\\index.js'));

if (isDirectRun) {
  const server = app.listen(config.port, () => {
    console.log(`[Meridian B2B Assistant Server] Running on http://localhost:${config.port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${config.port} is already in use.`);
    } else {
      console.error('[Server Error]:', err);
    }
  });
}

export default app;
