import { useState, type FormEvent } from 'react';
import type { Task, TaskUpdate } from '../types/task';
import { ConfirmDialog } from './ConfirmDialog';
import { inputClass } from './styles';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, changes: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const iconButtonClass =
  'rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800';

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setIsBusy(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setIsBusy(false);
    }
  }

  function startEditing() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setError(null);
    setIsEditing(true);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError('O título é obrigatório');
      return;
    }
    const saved = await run(() => onUpdate(task.id, { title, description }));
    if (saved) setIsEditing(false);
  }

  function handleConfirmDelete() {
    setIsConfirmingDelete(false);
    run(() => onDelete(task.id));
  }

  if (isEditing) {
    return (
      <li className="rounded-xl border border-indigo-300 bg-white p-3 shadow-sm dark:border-indigo-500/60 dark:bg-slate-900">
        <form
          onSubmit={handleSave}
          onKeyDown={(e) => e.key === 'Escape' && setIsEditing(false)}
          className="space-y-2"
          noValidate
        >
          <label htmlFor={`edit-title-${task.id}`} className="sr-only">
            Título
          </label>
          <input
            id={`edit-title-${task.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            autoFocus
            className={`${inputClass} py-1.5`}
          />
          <label htmlFor={`edit-description-${task.id}`} className="sr-only">
            Descrição
          </label>
          <textarea
            id={`edit-description-${task.id}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            maxLength={500}
            rows={2}
            className={`${inputClass} resize-none py-1.5 text-sm`}
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {isBusy ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={`group flex items-start gap-3 rounded-xl border p-3 shadow-sm transition hover:shadow-md ${
        task.completed
          ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      } ${isBusy ? 'opacity-60' : ''}`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        disabled={isBusy}
        onChange={() => run(() => onUpdate(task.id, { completed: !task.completed }))}
        aria-label={
          task.completed
            ? `Marcar "${task.title}" como pendente`
            : `Marcar "${task.title}" como concluída`
        }
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-indigo-600"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`font-medium break-words ${
            task.completed ? 'text-slate-400 line-through dark:text-slate-500' : ''
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-sm break-words whitespace-pre-line text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1 transition md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        <button
          type="button"
          onClick={startEditing}
          disabled={isBusy}
          aria-label={`Editar "${task.title}"`}
          title="Editar"
          className={iconButtonClass}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M16.86 3.49a2.1 2.1 0 0 1 2.97 2.97L7.5 18.79 3 20l1.21-4.5L16.86 3.49z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIsConfirmingDelete(true)}
          disabled={isBusy}
          aria-label={`Excluir "${task.title}"`}
          title="Excluir"
          className={`${iconButtonClass} hover:text-red-600 dark:hover:text-red-400`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M4 7h16M10 11v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <ConfirmDialog
        open={isConfirmingDelete}
        title="Excluir tarefa?"
        message={`"${task.title}" será excluída permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </li>
  );
}
