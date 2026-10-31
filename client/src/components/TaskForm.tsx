import { useState, type FormEvent } from 'react';
import type { TaskInput } from '../types/task';
import { cardClass, inputClass, primaryButtonClass } from './styles';

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
    <form onSubmit={handleSubmit} className={`${cardClass} space-y-3 p-4`} noValidate>
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
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-form-error' : undefined}
          className={inputClass}
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
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="task-form-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
        <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
          {isSubmitting ? 'Adicionando...' : 'Adicionar tarefa'}
        </button>
      </div>
    </form>
  );
}
