export type StatusTab = 'pending' | 'completed';

interface StatusTabsProps {
  active: StatusTab;
  counts: Record<StatusTab, number>;
  onChange: (tab: StatusTab) => void;
}

const TABS: { id: StatusTab; label: string }[] = [
  { id: 'pending', label: 'Pendentes' },
  { id: 'completed', label: 'Concluídas' },
];

export function StatusTabs({ active, counts, onChange }: StatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar tarefas por status"
      className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 md:hidden dark:bg-slate-800"
    >
      {TABS.map(({ id, label }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            onClick={() => onChange(id)}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {label}
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs dark:bg-slate-600">
              {counts[id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
