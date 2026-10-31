import type { Task, TaskUpdate } from '../types/task';
import type { StatusTab } from './StatusTabs';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  status: StatusTab;
  title: string;
  tasks: Task[];
  emptyMessage: string;
  isActiveTab: boolean;
  onUpdate: (id: number, changes: TaskUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskList({
  status,
  title,
  tasks,
  emptyMessage,
  isActiveTab,
  onUpdate,
  onDelete,
}: TaskListProps) {
  return (
    <section
      id={`panel-${status}`}
      role="tabpanel"
      aria-labelledby={`tab-${status}`}
      aria-label={title}
      className={`space-y-3 md:block ${isActiveTab ? 'block' : 'hidden'}`}
    >
      <h2 className="hidden items-center gap-2 font-semibold md:flex">
        {title}
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </h2>
      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
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
