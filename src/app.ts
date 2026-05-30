import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth.route';

const app: Application = express();

/**
 * 1. Core Middlewares (Execution order matters)
 */
app.use(helmet()); // Secure HTTP headers
app.use(cors());   // Cross-origin control
app.use(express.json({ limit: '10kb' })); // Prevent large payload abuse


/**
 * 2. Health Check Endpoint
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/auth', authRouter);

/**
 * 3. 404 Handler (Unknown Routes)
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not found'
  });
});

/**
 * 4. Global Error Handler (placeholder for now)
 */
app.use((err: Error, _req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});


export default app;