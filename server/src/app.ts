import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { tasksRouter } from './routes/tasks.routes.js';

export function createApp() {
  const app = express();

  // A API não tem autenticação: recusa no servidor chamadas de navegador vindas de outros sites.
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim());

  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (origin && !allowedOrigins.includes(origin)) {
      res.status(403).json({ error: 'Origem não permitida' });
      return;
    }
    next();
  });
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/tasks', tasksRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  app.use(errorHandler);

  return app;
}
