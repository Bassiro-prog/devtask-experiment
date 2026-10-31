import { useState, type FormEvent } from 'react';
import type { Task, TaskUpdate } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: number, changes: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  function handleDelete() {
    if (window.confirm(`Excluir a tarefa "${task.title}"?`)) {
      run(() => onDelete(task.id));
    }
  }

  if (isEditing) {
    return (
      <li className="rounded-xl border border-indigo-300 bg-white p-3 shadow-sm">
        <form onSubmit={handleSave} className="space-y-2">
          <label htmlFor={`edit-title-${task.id}`} className="sr-only">
            Título
          </label>
          <input
            id={`edit-title-${task.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            autoFocus
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              Salvar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        disabled={isBusy}
        onChange={() => run(() => onUpdate(task.id, { completed: !task.completed }))}
        aria-label={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        className="mt-1 size-5 cursor-pointer accent-indigo-600"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`font-medium break-words ${task.completed ? 'text-slate-400 line-through' : ''}`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 text-sm break-words whitespace-pre-line text-slate-500">
            {task.description}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={startEditing}
          disabled={isBusy}
          className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isBusy}
          className="rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </li>
  );
}
