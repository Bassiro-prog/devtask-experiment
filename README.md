# DevTask

Sistema simples e moderno de gerenciamento de tarefas.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`client/`)
- **Backend:** Node.js + Express + TypeScript (`server/`)
- **Banco de dados:** SQLite com Prisma ORM
- **Validação:** Zod
- **Testes:** Vitest + Supertest

## Pré-requisitos

- Node.js 20.19+, 22.13+ ou 24+ (recomendado: versão do arquivo `.nvmrc`)

## Como rodar

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3333 (o frontend redireciona `/api` para a API)

Na primeira execução, o banco SQLite é criado automaticamente em `server/dev.db`.
Para usar outro arquivo, defina a variável `DATABASE_URL` (ex.: `DATABASE_URL=file:./outro.db`).

## Segurança

O DevTask é um app pessoal para uso local: a API **não tem autenticação**. Por isso, por padrão
ela só escuta em `localhost` e só aceita requisições do navegador vindas de `http://localhost:5173`.

- `HOST`: endereço em que a API escuta (padrão `localhost`). Não use `0.0.0.0` sem colocar autenticação na frente.
- `CORS_ORIGIN`: origem permitida para chamadas do navegador (padrão `http://localhost:5173`).

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
