# DevTask

Sistema simples e moderno de gerenciamento de tarefas.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`client/`)
- **Backend:** Node.js + Express + TypeScript (`server/`)

## Pré-requisitos

- Node.js 20.19+, 22.13+ ou 24+ (recomendado: versão do arquivo `.nvmrc`)

## Como rodar

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3333 (o frontend redireciona `/api` para a API)

## Scripts

| Comando             | O que faz                                          |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Sobe frontend e backend em modo de desenvolvimento |
| `npm run build`     | Gera o build de produção dos dois projetos         |
| `npm run lint`      | Verifica o código com ESLint                       |
| `npm run typecheck` | Verifica os tipos com TypeScript                   |
| `npm run format`    | Formata o código com Prettier                      |
