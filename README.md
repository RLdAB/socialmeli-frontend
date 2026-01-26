# SocialMeli — Frontend (React + Vite)

Frontend do projeto **SocialMeli**, desenvolvido em **React (JavaScript ES6+)** com **React Router**, consumindo a API REST do backend SocialMeli.

O foco do projeto é **integração Frontend ↔ Backend**, clareza e funcionamento (não há exigência de design elaborado).

---

## Tecnologias
- React (Vite)
- JavaScript (ES6+)
- React Router DOM
- Fetch API
- Proxy do Vite (para evitar CORS em desenvolvimento)

---

## Requisitos atendidos
- Componentes funcionais
- Uso de `useState` e `useEffect`
- Rotas com React Router
- Menu de navegação sempre visível
- Conceito de **usuário ativo** (sem login) via **UserSelector**
- Integração centralizada em `src/services/api.js` (componentes não chamam `fetch` diretamente)

---

## Estrutura do projeto
```
src/
  pages/
  components/
  services/
    api.js
  App.jsx
  main.jsx
```

- **pages/**: telas/rotas
- **components/**: componentes reutilizáveis (Navigation, UserSelector, PostCard, Modal etc.)
- **services/api.js**: camada única para comunicação com a API

---

## Como rodar o projeto

### Pré-requisitos
- Node.js (recomendado: LTS)
- Backend SocialMeli rodando em `http://localhost:8080`

### 1) Instalar dependências
```bash
npm install
```

### 2) Rodar em modo desenvolvimento
```bash
npm run dev
```

Acesse:
- `http://localhost:5173`

---

## Proxy (CORS)
Durante o desenvolvimento, o frontend roda em `localhost:5173` e o backend em `localhost:8080`.

Para evitar problemas de CORS, o projeto usa **proxy do Vite** (`vite.config.js`) encaminhando chamadas para:
- `/users` → `http://localhost:8080`
- `/products` → `http://localhost:8080`
- `/sellers` → `http://localhost:8080`
- `/swagger` → `http://localhost:8080`

No `src/services/api.js`, o `BASE_URL` é vazio (`""`), pois as chamadas são feitas para paths relativos.

---

## Rotas do Frontend
Rotas principais (navegáveis pelo menu):

- `/` — Home
- `/users` — Usuários (listar e criar usuário via modal)
- `/followers` — Seguidos (redireciona para `/users/:userId/followers` usando usuário ativo)
- `/posts` — Posts (redireciona para `/users/:userId/feed` usando usuário ativo)
- `/publish` — Criar publicação
- `/users/:userId/followers` — Seguidores (“Quem me segue”)
- `/users/:userId/followed` — Quem eu sigo
- `/users/:userId/feed` — Feed
- `/users/:userId/promos` — Promoções

---

## Endpoints do Backend utilizados

### Usuários
- `GET /users` — listar usuários
- `POST /users` — criar usuário

### Followers / Followed
- `GET /users/{userId}/followers/list?order=name_asc|name_desc`
- `GET /users/{userId}/followed/list?order=name_asc|name_desc`

### Feed
- `GET /products/followed/{userId}/list?order=date_asc|date_desc&weeks=2`

### Publicações
- `POST /products/publish`

### Promoções
- `GET /products/promo-pub/list?user_id={userId}`

---

## Padrão de erros (Backend)
Quando ocorre erro, a API retorna JSON no formato:
```json
{ "error": "mensagem do erro" }
```

O `api.js` trata respostas `application/json` e também respostas `text/plain` (ex.: 404), evitando erros de parse.

---

## Fluxo de criação de usuário (exemplo)
1. Acesse `/users`
2. Clique em **Criar usuário**
3. Preencha `name` e marque (ou não) `is_seller`
4. Clique em **Criar**
5. Se o backend retornar **201**, o modal fecha e a lista é recarregada

---