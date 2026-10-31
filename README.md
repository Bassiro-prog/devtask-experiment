# DevTask

Sistema simples e moderno de gerenciamento de tarefas.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`client/`)
- **Backend:** Node.js + Express + TypeScript (`server/`)
- **Banco de dados:** SQLite com Prisma ORM
- **Validação:** Zod
- **Testes:** Vitest + Supertest (API) e Testing Library (interface)

## Pré-requisitos

- Node.js 20 ou superior (recomendado: versão do arquivo `.nvmrc`)

## Funcionalidades

- Criar, editar e excluir tarefas (com confirmação antes de excluir)
- Marcar tarefas como concluídas ou voltar para pendentes
- Tarefas separadas em **Pendentes** e **Concluídas**, com contadores e barra de progresso
- Layout responsivo: colunas lado a lado no desktop, abas no celular
- Tema claro/escuro (segue o sistema e lembra a sua escolha)
- Dados salvos em banco SQLite

## Como rodar

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3333 (o frontend redireciona `/api` para a API)

Na primeira execução, o banco SQLite é criado automaticamente em `server/dev.db`.
Para usar outro arquivo, defina a variável `DATABASE_URL` (ex.: `DATABASE_URL=file:./outro.db`).

## API

| Método   | Rota             | Descrição                                                        |
| -------- | ---------------- | ---------------------------------------------------------------- |
| `GET`    | `/api/tasks`     | Lista tarefas (filtro opcional `?status=pending` ou `completed`) |
| `POST`   | `/api/tasks`     | Cria tarefa: `{ "title": "...", "description": "..." }`          |
| `PATCH`  | `/api/tasks/:id` | Edita `title`, `description` e/ou `completed`                    |
| `DELETE` | `/api/tasks/:id` | Exclui tarefa                                                    |

Erros de validação retornam `400` com `{ "error": "mensagem" }`; tarefa inexistente retorna `404`.

## Scripts

| Comando             | O que faz                                          |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Sobe frontend e backend em modo de desenvolvimento |
| `npm run build`     | Gera o build de produção dos dois projetos         |
| `npm test`          | Roda os testes da API                              |
| `npm run lint`      | Verifica o código com ESLint                       |
| `npm run typecheck` | Verifica os tipos com TypeScript                   |
| `npm run format`    | Formata o código com Prettier                      |

### Banco de dados (dentro de `server/`)

- `npm run db:migrate -- --name <nome>`: cria uma nova migração após alterar `prisma/schema.prisma`
- `npm run db:studio`: abre o Prisma Studio para visualizar os dados

## Estrutura do projeto

```
devtask-experiment/
├── client/                  # Frontend (React + Vite + Tailwind)
│   └── src/
│       ├── components/      # Header, TaskForm, TaskList, TaskCard, StatusTabs, ConfirmDialog...
│       ├── hooks/           # useTasks (estado + chamadas à API), useTheme
│       ├── services/        # api.ts (fetch para /api/tasks)
│       ├── types/           # tipo Task
│       └── App.tsx
├── server/                  # Backend (Express + Prisma)
│   ├── prisma/              # schema.prisma e migrações
│   ├── src/
│   │   ├── routes/          # tasks.routes.ts
│   │   ├── controllers/     # lógica de cada rota
│   │   ├── validators/      # schemas Zod
│   │   ├── middlewares/     # tratamento de erros
│   │   └── lib/             # cliente Prisma
│   └── tests/               # testes da API
└── package.json             # scripts que rodam client + server juntos
```

## Produção

```bash
npm run build
npm run start -w server   # API em http://localhost:3333
```

O build do frontend fica em `client/dist/` e pode ser servido por qualquer hospedagem estática,
desde que as requisições para `/api` sejam encaminhadas para a API.
