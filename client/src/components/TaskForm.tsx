import { useState, type FormEvent } from 'react';
import type { TaskInput } from '../types/task';

interface TaskFormProps {
  onSubmit: (input: TaskInput) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError('O título é obrigatório');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ title, description });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor="task-title" className="sr-only">
          Título da tarefa
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="O que você precisa fazer?"
          maxLength={120}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label htmlFor="task-description" className="sr-only">
          Descrição (opcional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição (opcional)"
          maxLength={500}
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar tarefa'}
        </button>
      </div>
    </form>
  );
}
