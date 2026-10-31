/** Porcentagem concluída: só é 100 com tudo concluído e só é 0 sem nada concluído. */
export function taskProgress(completed: number, total: number) {
  if (total === 0 || completed === 0) return 0;
  if (completed >= total) return 100;
  return Math.min(99, Math.max(1, Math.round((completed / total) * 100)));
}
