import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

export default function App() {
  const { pending, completed, isLoading, error, reload, createTask, updateTask, deleteTask } =
    useTasks();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <Header />
        <TaskForm onSubmit={createTask} />

        {isLoading ? (
          <p className="text-center text-slate-500">Carregando tarefas...</p>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}{' '}
            <button type="button" onClick={reload} className="font-medium underline">
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <TaskList
              title="Pendentes"
              tasks={pending}
              emptyMessage="Nenhuma tarefa pendente. Adicione uma acima!"
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
            <TaskList
              title="Concluídas"
              tasks={completed}
              emptyMessage="Nenhuma tarefa concluída ainda."
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          </div>
        )}
      </main>
    </div>
  );
}
