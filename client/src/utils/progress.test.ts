import { describe, expect, it } from 'vitest';
import { taskProgress } from './progress';

describe('taskProgress', () => {
  it('calcula a porcentagem arredondada', () => {
    expect(taskProgress(1, 2)).toBe(50);
    expect(taskProgress(1, 3)).toBe(33);
  });

  it('só mostra 100% com todas as tarefas concluídas', () => {
    expect(taskProgress(199, 200)).toBe(99);
    expect(taskProgress(3, 3)).toBe(100);
  });

  it('só mostra 0% sem nenhuma tarefa concluída', () => {
    expect(taskProgress(1, 300)).toBe(1);
    expect(taskProgress(0, 5)).toBe(0);
    expect(taskProgress(0, 0)).toBe(0);
  });
});
