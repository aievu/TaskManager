# TaskManager

## Objetivo

O TaskManager é um sistema para gerenciamento de tarefas, desenvolvido com Laravel e React, que visa facilitar o controle, organização e segurança das atividades dosdd  usuários.
---

## Funcionalidades

- **Gerenciamento de Tarefas:** Criação, edição, exclusão e listagem de tarefas.
- **Autenticação de Usuário:** Login seguro utilizando Laravel Fortify.
- **Interface Moderna:** Frontend em React (Inertia.js) para uma experiência fluida.

---

## Endpoints Principais

### Tarefas

- `GET /tasks` — Lista tarefas
- `POST /tasks/store` — Cria nova tarefa
- `PUT /tasks/{id}/toggle` — Marca ou desmarca como concluida
- `PUT /tasks/{id}/update` — Atualiza tarefa
- `DELETE /tasks/{id}/destroy` — Remove tarefa

---

## Como configurar o ambiente

### 1. Pré-requisitos

- PHP >= 8.2
- Composer
- Node.js e npm
- Banco de dados (MySQL, PostgreSQL, etc.)

### 2. Instalação

Clone o repositório:

```sh
git clone https://github.com/aievu/TaskManager.git
cd TaskManager
```

Instale as dependências do PHP com o Composer:

```sh
composer install
```

Instale as dependências do Node.js com npm:

```sh
npm install
```

### 3. Configuração do Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente.

```sh
cp .env.example .env
```

Gere a chave da aplicação:

```sh
php artisan key:generate
```

Execute as migrações do banco de dados:

```sh
php artisan migrate
```

### 4. Executando o Projeto

Inicie o servidor de desenvolvimento:

```sh
composer run dev
```

Acesse o aplicativo em `http://127.0.0.1:8000/`.

---
