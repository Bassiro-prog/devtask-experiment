import { z } from 'zod';

const title = z
  .string({ error: 'O título é obrigatório' })
  .trim()
  .min(1, 'O título é obrigatório')
  .max(120, 'O título deve ter no máximo 120 caracteres');

const description = z
  .string()
  .trim()
  .max(500, 'A descrição deve ter no máximo 500 caracteres')
  .nullish()
  .transform((value) => value || null);

export const createTaskSchema = z.object({ title, description });

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Informe ao menos um campo para atualizar',
  });

export const taskIdSchema = z.coerce.number().int().positive();

export const listTasksQuerySchema = z.object({
  status: z.enum(['pending', 'completed']).optional(),
});
