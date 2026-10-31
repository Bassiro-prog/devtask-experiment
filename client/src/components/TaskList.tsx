import type { Task, TaskUpdate } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  onUpdate: (id: number, changes: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({ title, tasks, emptyMessage, onUpdate, onDelete }: TaskListProps) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold">
        {title}
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
          {tasks.length}
        </span>
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
