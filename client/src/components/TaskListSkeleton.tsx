export function TaskListSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Carregando tarefas...
      </p>
      <div className="grid gap-6 md:grid-cols-2" aria-hidden="true">
        {[0, 1].map((column) => (
          <div key={column} className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            {[0, 1, 2].map((row) => (
              <div
                key={row}
                className="h-16 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/70"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
