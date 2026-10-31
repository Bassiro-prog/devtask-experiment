import type { Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { HttpError } from '../middlewares/error-handler.js';
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdSchema,
  updateTaskSchema,
} from '../validators/task.validators.js';

const taskNotFound = () => new HttpError(404, 'Tarefa não encontrada');

function parseTaskId(rawId: unknown) {
  const parsed = taskIdSchema.safeParse(rawId);
  if (!parsed.success) {
    throw taskNotFound();
  }
  return parsed.data;
}

function isRecordNotFound(err: unknown) {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025';
}

export async function listTasks(req: Request, res: Response) {
  const { status } = listTasksQuerySchema.parse(req.query);
  const tasks = await prisma.task.findMany({
    where: status ? { completed: status === 'completed' } : undefined,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
  res.json(tasks);
}

export async function createTask(req: Request, res: Response) {
  const data = createTaskSchema.parse(req.body);
  const task = await prisma.task.create({ data });
  res.status(201).json(task);
}

export async function updateTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id);
  const data = updateTaskSchema.parse(req.body);
  try {
    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
  } catch (err) {
    throw isRecordNotFound(err) ? taskNotFound() : err;
  }
}

export async function deleteTask(req: Request, res: Response) {
  const id = parseTaskId(req.params.id);
  try {
    await prisma.task.delete({ where: { id } });
  } catch (err) {
    throw isRecordNotFound(err) ? taskNotFound() : err;
  }
  res.status(204).end();
}
