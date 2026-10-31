import { vi } from 'vitest';
import type { Task } from '../types/task';

/** Simula a API REST de tarefas em memória substituindo o `fetch` global. */
export function mockTasksApi(initial: Partial<Task>[] = []) {
  let nextId = 1;
  const now = new Date().toISOString();
  const build = (data: Partial<Task>): Task => ({
    id: nextId++,
    title: '',
    description: null,
    completed: false,
    createdAt: now,
    updatedAt: now,
    ...data,
  });
  const state = { tasks: initial.map(build), failNext: false };

  const json = (body: unknown, status = 200) =>
    new Response(status === 204 ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });

  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (state.failNext) {
      state.failNext = false;
      return json({ error: 'Falha simulada no servidor' }, 500);
    }
    const url = String(input);
    const method = init?.method ?? 'GET';
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    const id = Number(url.split('/').pop());

    if (method === 'GET') return json(state.tasks);
    if (method === 'POST') {
      const task = build({ title: body.title.trim(), description: body.description || null });
      state.tasks.unshift(task);
      return json(task, 201);
    }
    const index = state.tasks.findIndex((t) => t.id === id);
    if (index === -1) return json({ error: 'Tarefa não encontrada' }, 404);
    if (method === 'PATCH') {
      state.tasks[index] = { ...state.tasks[index], ...body };
      return json(state.tasks[index]);
    }
    state.tasks.splice(index, 1);
    return json(null, 204);
  });

  vi.stubGlobal('fetch', fetchMock);
  return { state, fetchMock };
}
