import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/error-handler.js';
import { tasksRouter } from './routes/tasks.routes.js';

export function createApp() {
  const app = express();

  app.use(cors());
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
