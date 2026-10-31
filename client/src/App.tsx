import { useState } from 'react';
import { Header } from './components/Header';
import { StatusTabs, type StatusTab } from './components/StatusTabs';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { TaskListSkeleton } from './components/TaskListSkeleton';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const { pending, completed, isLoading, error, reload, createTask, updateTask, deleteTask } =
    useTasks();
  const [activeTab, setActiveTab] = useState<StatusTab>('pending');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-10">
        <Header total={pending.length + completed.length} completed={completed.length} />
        <TaskForm onSubmit={createTask} />

        {isLoading ? (
          <TaskListSkeleton />
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={reload}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <StatusTabs
              active={activeTab}
              counts={{ pending: pending.length, completed: completed.length }}
              onChange={setActiveTab}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TaskList
                status="pending"
                title="Pendentes"
                tasks={pending}
                emptyMessage="Nenhuma tarefa pendente. Adicione uma acima!"
                isActiveTab={activeTab === 'pending'}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
              <TaskList
                status="completed"
                title="Concluídas"
                tasks={completed}
                emptyMessage="Nenhuma tarefa concluída ainda."
                isActiveTab={activeTab === 'completed'}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
