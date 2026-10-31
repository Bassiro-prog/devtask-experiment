import { taskProgress } from '../utils/progress';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  total: number;
  completed: number;
}

export function Header({ total, completed }: HeaderProps) {
  const progress = taskProgress(completed, total);

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DevTask</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Organize suas tarefas de forma simples
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {total > 0 && (
        <div>
          <div className="mb-1 flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>
              {completed} de {total} {total === 1 ? 'tarefa concluída' : 'tarefas concluídas'}
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Progresso das tarefas"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
