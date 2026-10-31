export function Header() {
  return (
    <header className="flex items-center gap-3">
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
        <p className="text-sm text-slate-500">Organize suas tarefas de forma simples</p>
      </div>
    </header>
  );
}
