import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/lib/prisma.js';

const app = createApp();

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/tasks', () => {
  it('cria uma tarefa pendente', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '  Estudar Prisma  ', description: 'Ler a documentação' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      title: 'Estudar Prisma',
      description: 'Ler a documentação',
      completed: false,
    });
  });

  it('salva descrição vazia como null', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Tarefa', description: '' });

    expect(res.status).toBe(201);
    expect(res.body.description).toBeNull();
  });

  it('rejeita título vazio', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('O título é obrigatório');
  });

  it('rejeita JSON inválido', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Content-Type', 'application/json')
      .send('{"title":');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('JSON inválido');
  });
});

describe('GET /api/tasks', () => {
  it('lista tarefas da mais recente para a mais antiga e filtra por status', async () => {
    const first = await prisma.task.create({
      data: { title: 'Primeira', createdAt: new Date('2024-01-01') },
    });
    const second = await prisma.task.create({
      data: { title: 'Segunda', completed: true, createdAt: new Date('2024-01-02') },
    });

    const all = await request(app).get('/api/tasks');
    expect(all.body.map((t: { id: number }) => t.id)).toEqual([second.id, first.id]);

    const pending = await request(app).get('/api/tasks?status=pending');
    expect(pending.body.map((t: { id: number }) => t.id)).toEqual([first.id]);

    const completed = await request(app).get('/api/tasks?status=completed');
    expect(completed.body.map((t: { id: number }) => t.id)).toEqual([second.id]);
  });

  it('rejeita status inválido', async () => {
    const res = await request(app).get('/api/tasks?status=foo');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('edita título e marca como concluída', async () => {
    const task = await prisma.task.create({ data: { title: 'Antiga' } });

    const res = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ title: 'Nova', completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: task.id, title: 'Nova', completed: true });
  });

  it('volta uma tarefa concluída para pendente', async () => {
    const task = await prisma.task.create({ data: { title: 'Feita', completed: true } });

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({ completed: false });

    expect(res.body.completed).toBe(false);
  });

  it('rejeita corpo vazio', async () => {
    const task = await prisma.task.create({ data: { title: 'Tarefa' } });

    const res = await request(app).patch(`/api/tasks/${task.id}`).send({});

    expect(res.status).toBe(400);
  });

  it('retorna 404 para tarefa inexistente ou id inválido', async () => {
    expect((await request(app).patch('/api/tasks/999').send({ completed: true })).status).toBe(404);
    expect((await request(app).patch('/api/tasks/abc').send({ completed: true })).status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('exclui a tarefa', async () => {
    const task = await prisma.task.create({ data: { title: 'Excluir' } });

    const res = await request(app).delete(`/api/tasks/${task.id}`);

    expect(res.status).toBe(204);
    expect(await prisma.task.count()).toBe(0);
  });

  it('retorna 404 para tarefa inexistente', async () => {
    const res = await request(app).delete('/api/tasks/999');
    expect(res.status).toBe(404);
  });
});
