import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middlewares/error-handler.js';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validators/task.validators.js';

async function findTaskOrThrow(rawId: unknown) {
  const parsed = taskIdSchema.safeParse(rawId);
  const task = parsed.success ? await prisma.task.findUnique({ where: { id: parsed.data } }) : null;
  if (!task) {
    throw new HttpError(404, 'Tarefa não encontrada');
  }
  return task;
}

export async function listTasks(req: Request, res: Response) {
  const { status } = listTasksQuerySchema.parse(req.query);
  const tasks = await prisma.task.findMany({
    where: status ? { completed: status === 'completed' } : undefined,
    orderBy: { createdAt: 'desc' },
  });
  res.json(tasks);
}

export async function createTask(req: Request, res: Response) {
  const data = createTaskSchema.parse(req.body);
  const task = await prisma.task.create({ data });
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const { id } = await findTaskOrThrow(req.params.id);
  const data = updateTaskSchema.parse(req.body);
  const task = await prisma.task.update({ where: { id }, data });
  res.json(task);
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = await findTaskOrThrow(req.params.id);
  await prisma.task.delete({ where: { id } });
  res.status(204).end();
}
