import type { Task, TaskInput, TaskUpdate } from '../types/task';

const BASE_URL = '/api/tasks';

export class ApiError extends Error {}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.error ?? 'Algo deu errado. Tente novamente.');
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export const tasksApi = {
  list: () => request<Task[]>(BASE_URL),
  create: (input: TaskInput) =>
    request<Task>(BASE_URL, { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, changes: TaskUpdate) =>
    request<Task>(`${BASE_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  remove: (id: number) => request<void>(`${BASE_URL}/${id}`, { method: 'DELETE' }),
};
