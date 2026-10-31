import { useCallback, useEffect, useMemo, useState } from 'react';
import { tasksApi } from '../services/api';
import type { Task, TaskInput, TaskUpdate } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setTasks(await tasksApi.list());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    tasksApi
      .list()
      .then(
        (data) => !ignore && setTasks(data),
        (err: Error) => !ignore && setError(err.message),
      )
      .finally(() => !ignore && setIsLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const reload = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (input: TaskInput) => {
      const task = await tasksApi.create(input);
      if (!error) {
        setTasks((current) => [task, ...current]);
        return;
      }
      // A API voltou depois de uma falha no carregamento: busca a lista completa.
      try {
        setTasks(await tasksApi.list());
        setError(null);
      } catch (err) {
        setError(
          `Tarefa "${task.title}" criada, mas a lista não pôde ser carregada: ${(err as Error).message}`,
        );
      }
    },
    [error],
  );

  const updateTask = useCallback(async (id: number, changes: TaskUpdate) => {
    const task = await tasksApi.update(id, changes);
    setTasks((current) => current.map((t) => (t.id === id ? task : t)));
  }, []);

  const deleteTask = useCallback(async (id: number) => {
    await tasksApi.remove(id);
    setTasks((current) => current.filter((t) => t.id !== id));
  }, []);

  const { pending, completed } = useMemo(
    () => ({
      pending: tasks.filter((t) => !t.completed),
      completed: tasks.filter((t) => t.completed),
    }),
    [tasks],
  );

  return {
    pending,
    completed,
    isLoading,
    error,
    reload,
    createTask,
    updateTask,
    deleteTask,
  };
}
