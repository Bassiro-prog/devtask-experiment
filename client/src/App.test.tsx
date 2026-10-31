import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { mockTasksApi } from './test/fake-api';

afterEach(() => {
  vi.unstubAllGlobals();
});

function getPanel(name: 'Pendentes' | 'Concluídas') {
  return screen.getByRole('tabpanel', { name: new RegExp(name) });
}

describe('App', () => {
  it('separa as tarefas em pendentes e concluídas', async () => {
    mockTasksApi([
      { title: 'Estudar React' },
      { title: 'Configurar Prisma', completed: true, description: 'Banco SQLite' },
    ]);
    render(<App />);
    await screen.findByText('Estudar React');

    expect(within(getPanel('Pendentes')).getByText('Estudar React')).toBeInTheDocument();
    expect(within(getPanel('Concluídas')).getByText('Configurar Prisma')).toBeInTheDocument();
    expect(within(getPanel('Concluídas')).getByText('Banco SQLite')).toBeInTheDocument();
    expect(screen.getByText('1 de 2 tarefas concluídas')).toBeInTheDocument();
  });

  it('mostra estados vazios', async () => {
    mockTasksApi();
    render(<App />);

    expect(
      await screen.findByText('Nenhuma tarefa pendente. Adicione uma acima!'),
    ).toBeInTheDocument();
    expect(screen.getByText('Nenhuma tarefa concluída ainda.')).toBeInTheDocument();
  });

  it('cria uma tarefa e limpa o formulário', async () => {
    const { state } = mockTasksApi();
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Nenhuma tarefa concluída ainda.');

    await user.type(screen.getByLabelText('Título da tarefa'), 'Nova tarefa');
    await user.type(screen.getByLabelText('Descrição (opcional)'), 'Detalhes');
    await user.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));

    expect(await within(getPanel('Pendentes')).findByText('Nova tarefa')).toBeInTheDocument();
    expect(screen.getByLabelText('Título da tarefa')).toHaveValue('');
    expect(state.tasks).toHaveLength(1);
  });

  it('não envia tarefa sem título', async () => {
    const { fetchMock } = mockTasksApi();
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Nenhuma tarefa concluída ainda.');

    await user.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));

    expect(screen.getByText('O título é obrigatório')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('marca como concluída e volta para pendente', async () => {
    mockTasksApi([{ title: 'Estudar React' }]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByLabelText('Marcar "Estudar React" como concluída'));
    expect(await within(getPanel('Concluídas')).findByText('Estudar React')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Marcar "Estudar React" como pendente'));
    expect(await within(getPanel('Pendentes')).findByText('Estudar React')).toBeInTheDocument();
  });

  it('edita uma tarefa', async () => {
    const { state } = mockTasksApi([{ title: 'Título antigo' }]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Editar "Título antigo"' }));
    const input = screen.getByLabelText('Título');
    await user.clear(input);
    await user.type(input, 'Título novo');
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Título novo')).toBeInTheDocument();
    expect(state.tasks[0].title).toBe('Título novo');
  });

  it('exclui uma tarefa só após confirmar', async () => {
    const { state } = mockTasksApi([{ title: 'Apagar isto' }]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Excluir "Apagar isto"' }));
    const dialog = screen.getByRole('dialog', { name: 'Excluir tarefa?' });
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));
    expect(state.tasks).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Excluir "Apagar isto"' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Excluir tarefa?' })).getByRole('button', {
        name: 'Excluir',
      }),
    );

    await waitFor(() => expect(screen.queryByText('Apagar isto')).not.toBeInTheDocument());
    expect(state.tasks).toHaveLength(0);
  });

  it('mostra erro ao carregar e permite tentar novamente', async () => {
    const { state } = mockTasksApi([{ title: 'Recuperada' }]);
    state.failNext = true;
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText('Falha simulada no servidor')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Recuperada')).toBeInTheDocument();
  });

  it('alterna entre as abas no celular', async () => {
    mockTasksApi([{ title: 'A fazer' }, { title: 'Feita', completed: true }]);
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('A fazer');

    expect(screen.getByRole('tab', { name: /Pendentes/ })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: /Concluídas/ }));

    expect(screen.getByRole('tab', { name: /Concluídas/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(getPanel('Concluídas')).toHaveClass('block');
    expect(getPanel('Pendentes')).toHaveClass('hidden');
  });

  it('alterna o tema e salva a preferência', async () => {
    mockTasksApi();
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ativar tema escuro' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('devtask-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument();
  });

  it('mostra a lista completa ao criar uma tarefa depois de falha no carregamento', async () => {
    const { state } = mockTasksApi([{ title: 'Recuperada' }]);
    state.failNext = true;
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Falha simulada no servidor');

    await user.type(screen.getByLabelText('Título da tarefa'), 'Nova tarefa');
    await user.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));

    expect(await within(getPanel('Pendentes')).findByText('Nova tarefa')).toBeInTheDocument();
    expect(within(getPanel('Pendentes')).getByText('Recuperada')).toBeInTheDocument();
    expect(screen.queryByText('Falha simulada no servidor')).not.toBeInTheDocument();
  });

  it('avisa que a tarefa foi criada quando a lista ainda não carrega', async () => {
    const { state, fetchMock } = mockTasksApi([{ title: 'Recuperada' }]);
    state.failNext = true;
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('Falha simulada no servidor');

    const realFetch = fetchMock.getMockImplementation()!;
    fetchMock.mockImplementation(async (input, init) =>
      (init?.method ?? 'GET') === 'GET'
        ? new Response(JSON.stringify({ error: 'Servidor fora do ar' }), { status: 500 })
        : realFetch(input, init),
    );
    await user.type(screen.getByLabelText('Título da tarefa'), 'Pagar aluguel');
    await user.click(screen.getByRole('button', { name: 'Adicionar tarefa' }));

    expect(
      await screen.findByText(/Tarefa "Pagar aluguel" criada, mas a lista não pôde ser carregada/),
    ).toBeInTheDocument();
    expect(state.tasks).toHaveLength(2);
  });

  it('não permite cancelar a edição enquanto salva', async () => {
    const { fetchMock } = mockTasksApi([{ title: 'Editar' }]);
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Editar "Editar"' }));
    fetchMock.mockImplementationOnce(() => new Promise<Response>(() => {}));
    await user.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });

  it('anuncia o carregamento para leitores de tela', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>(() => {})),
    );
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando tarefas...');
  });

  it('segue o tema do sistema sem salvar enquanto não há escolha manual', async () => {
    const listeners: ((event: MediaQueryListEvent) => void)[] = [];
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: (_: string, fn: (event: MediaQueryListEvent) => void) =>
          listeners.push(fn),
        removeEventListener: vi.fn(),
      })),
    );
    mockTasksApi();
    render(<App />);
    await screen.findByText('Nenhuma tarefa concluída ainda.');

    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('devtask-theme')).toBeNull();

    act(() => listeners.forEach((fn) => fn({ matches: false } as MediaQueryListEvent)));
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('devtask-theme')).toBeNull();
  });
});
