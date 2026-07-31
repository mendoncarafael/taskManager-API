# Task Manager API

API REST para gerenciamento de tarefas em equipe, desenvolvida como projeto de estudos em back-end com foco em relacionamentos entre entidades, controle de acesso por papéis e rastreamento de histórico de alterações.

## Objetivo

Esta API simula um fluxo de gestão de tarefas em times: cadastro de usuários, criação de times, atribuição de membros, criação de tarefas vinculadas a um time, atribuição de responsáveis e registro automático do histórico de mudanças de status.

## Funcionalidades

- Cadastro, listagem e atualização de usuários
- Autenticação com JWT
- Controle de acesso por roles (`admin` e `member`)
- Criação e gerenciamento de times
- Adição e remoção de membros de um time
- Criação, listagem, atualização e exclusão de tarefas
- Atribuição de tarefas a um usuário
- Filtro de tarefas por status
- Histórico de mudanças de status por tarefa
- Validação de dados com Zod
- Tratamento centralizado de erros

## Stack utilizada

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Docker

## Pré-requisitos

- Node.js 18+
- Docker
- npm ou yarn

## Configuração do ambiente

1. Suba o banco de dados com Docker:

```bash
docker compose up -d
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskmanager
JWT_SECRET=seu-segredo-aqui
PORT=3333
```

4. Gere o cliente do Prisma e aplique as migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

5. Inicie o servidor:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`.

## Estrutura do projeto

```
src/
├── app.ts                 # Configuração do Express
├── env.ts                 # Validação de variáveis de ambiente
├── server.ts              # Ponto de entrada da aplicação
├── configs/                # Configurações auxiliares, como JWT
├── controllers/             # Lógica dos endpoints
├── middlewares/             # Autenticação, autorização e tratamento de erros
├── routes/                 # Definição das rotas
├── types/                  # Tipagens TypeScript
└── utils/                  # Classes de erro customizadas
prisma/
├── schema.prisma           # Definição dos modelos e relações
└── migrations/              # Arquivos de migração
```

## Endpoints principais

### Usuários

#### Criar usuário

```
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

#### Login

```
POST /sessions
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Times

```
POST /teams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Time de Backend",
  "description": "Responsável pela API"
}
```

```
POST /teams/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userID": "uuid-do-usuario",
  "teamID": "uuid-do-time"
}
```

### Tarefas

```
POST /tasks
Content-Type: application/json

{
  "title": "Configurar CI/CD",
  "description": "Adicionar pipeline de deploy",
  "teamID": "uuid-do-time",
  "priority": "high"
}
```

```
PATCH /tasks/:id/:userID/task
```

Atribui a tarefa `:id` ao usuário `:userID`.

```
GET /tasks/filter?status=pending
```

### Histórico de tarefas

```
PATCH /tasksHistory
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskID": "uuid-da-tarefa",
  "oldStatus": "pending",
  "newStatus": "in_progress"
}
```

## Regras de negócio

- Usuários possuem uma role: `admin` ou `member`
- Apenas `admin` pode criar/editar/excluir times e gerenciar seus membros
- Tarefas possuem status: `pending`, `in_progress` ou `completed`
- Tarefas possuem prioridade: `high`, `medium` ou `low`
- Toda mudança de status de uma tarefa gera um registro no histórico, com o status anterior, o novo status e o usuário responsável pela mudança

## Observações

Este projeto foi criado para fins de estudo e prática de desenvolvimento back-end com Node.js, TypeScript e Prisma. A estrutura foi pensada para ser simples, didática e facilmente expandida com novas funcionalidades.
