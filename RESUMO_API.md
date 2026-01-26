# Resumo Detalhado da API SocialMeli

## 📋 Visão Geral

A **API SocialMeli** é uma API REST desenvolvida em **Go (Golang)** que implementa um sistema de rede social para marketplace, permitindo que usuários sigam vendedores e visualizem produtos e promoções. A arquitetura segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas.

---

## 🏗️ Arquitetura

### Estrutura de Camadas

A API está organizada em três módulos principais:

1. **`internal/user`** - Gerenciamento de usuários e relacionamentos de follow
2. **`internal/post`** - Gerenciamento de publicações de produtos e promoções
3. **`cmd/server`** - Configuração do servidor HTTP e rotas

Cada módulo segue a estrutura de Clean Architecture:

```
internal/
├── user/
│   ├── domain/          # Entidades e regras de negócio
│   ├── application/      # Casos de uso e serviços
│   └── infrastructure/   # Implementações (API, persistência)
│       ├── api/         # Handlers HTTP e DTOs
│       └── persistence/ # Repositórios GORM
└── post/
    ├── domain/
    ├── application/
    └── infrastructure/
```

---

## 📊 Entidades e Modelos

### 1. **User (Usuário)**

**Estrutura:**
```go
type User struct {
    ID         uint           `json:"id" gorm:"primaryKey"`
    CreatedAt  time.Time      `json:"-"`
    UpdatedAt  time.Time      `json:"-"`
    DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
    Name       string         `json:"name" validate:"required,max=15"`
    IsSeller   bool           `json:"is_seller"`
}
```

**Características:**
- **ID**: Chave primária auto-incrementável
- **Name**: Nome do usuário (máximo 15 caracteres, obrigatório)
- **IsSeller**: Flag booleana que indica se o usuário é vendedor
- **Soft Delete**: Suporta exclusão lógica via `DeletedAt`

**Regras de Negócio:**
- Um usuário não pode seguir a si mesmo
- Apenas usuários com `IsSeller = true` podem ser seguidos
- Apenas sellers podem criar publicações

---

### 2. **Follow (Relacionamento de Seguir)**

**Estrutura:**
```go
type Follow struct {
    FollowerID uint `gorm:"primaryKey;autoIncrement:false"`
    SellerID   uint `gorm:"primaryKey;autoIncrement:false"`
}
```

**Características:**
- **Chave Composta**: `(FollowerID, SellerID)` formam a chave primária
- **FollowerID**: ID do usuário que está seguindo
- **SellerID**: ID do vendedor sendo seguido

**Cardinalidade:**
- **Many-to-Many**: Um usuário pode seguir múltiplos vendedores
- **Many-to-Many**: Um vendedor pode ter múltiplos seguidores
- **Relação Unidirecional**: Apenas sellers podem ser seguidos

---

### 3. **Post (Publicação)**

**Estrutura:**
```go
type Post struct {
    ID            uint           `json:"id" gorm:"primaryKey"`
    CreatedAt     time.Time      `json:"created_at" gorm:"autoCreateTime"`
    UpdatedAt     time.Time      `json:"updated_at"`
    DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
    
    UserID        uint      `json:"user_id" gorm:"index"`
    ProductID     uint      `json:"product_id"`
    ProductName   string    `json:"product_name" gorm:"size:100"`
    ProductType   string    `json:"product_type,omitempty"`
    ProductBrand  string    `json:"product_brand,omitempty"`
    Category      string    `json:"category"`
    Content       string    `json:"content" gorm:"type:text"`
    Price         float64   `json:"price" gorm:"type:decimal(10,2)"`
    HasPromo      bool      `json:"has_promo"`
    Discount      float64   `json:"discount" gorm:"type:decimal(5,2)"`
    PromoEndsAt   time.Time `json:"promo_ends_at,omitempty"`
}
```

**Características:**
- **UserID**: Referência ao vendedor que criou a publicação (FK para User)
- **ProductID**: ID do produto
- **HasPromo**: Indica se é uma publicação promocional
- **Discount**: Percentual de desconto (0-1, ex: 0.15 = 15%)
- **Price**: Preço do produto (decimal com 2 casas)

**Tipos de Publicação:**
1. **Produto Normal**: `HasPromo = false`, `Discount = 0`
2. **Produto Promocional**: `HasPromo = true`, `Discount > 0`

---

## 🔗 Relacionamentos e Cardinalidade

### Diagrama de Relacionamentos

```
┌─────────┐                    ┌─────────┐
│  User   │                    │  Post   │
├─────────┤                    ├─────────┤
│ ID (PK) │◄──────────────────┤ UserID  │ (FK)
│ Name    │    1:N             │ Product │
│IsSeller │                    │ Price   │
└─────────┘                    │HasPromo │
     │                          └─────────┘
     │                                ▲
     │                                │
     │                          ┌─────────┐
     │                          │ Follow  │
     └──────────────────────────┤         │
            N:M                ├─────────┤
                               │Follower │ (FK → User.ID)
                               │SellerID │ (FK → User.ID)
                               └─────────┘
```

### Detalhamento dos Relacionamentos

#### 1. **User ↔ Follow (Many-to-Many)**

- **User como Follower**: Um usuário pode seguir múltiplos vendedores
  - Cardinalidade: `1 User : N Follows` (lado FollowerID)
  
- **User como Seller**: Um vendedor pode ter múltiplos seguidores
  - Cardinalidade: `1 User : N Follows` (lado SellerID)
  
- **Relação Total**: `N Users : M Sellers` (Many-to-Many via tabela Follow)

**Restrições:**
- Um usuário não pode seguir a si mesmo
- Apenas usuários com `IsSeller = true` podem ser seguidos
- Não permite duplicatas (chave composta previne)

---

#### 2. **User ↔ Post (One-to-Many)**

- **User → Post**: Um vendedor pode criar múltiplas publicações
  - Cardinalidade: `1 User : N Posts`
  - Relacionamento: `User.ID = Post.UserID`
  
- **Post → User**: Cada publicação pertence a um único vendedor
  - Cardinalidade: `N Posts : 1 User`
  
**Restrições:**
- Apenas usuários com `IsSeller = true` podem criar posts
- Quando um usuário é deletado, seus posts podem ser deletados (CASCADE)

---

#### 3. **Follow ↔ Post (Indireto via User)**

- Um usuário visualiza posts dos vendedores que segue através do relacionamento:
  ```
  User (follower) → Follow → User (seller) → Post
  ```

---

## 🎯 Principais Funcionalidades

### Módulo de Usuários (`internal/user`)

#### **1. CRUD de Usuários**

- **`POST /users`** - Criar usuário
  - Validação: nome obrigatório, máximo 15 caracteres
  - Retorna: `201 Created` com dados do usuário criado

- **`GET /users`** - Listar todos os usuários
  - Retorna: Lista completa de usuários

- **`GET /users/{userId}`** - Buscar usuário por ID
  - Retorna: `200 OK` com dados do usuário ou `404 Not Found`

- **`PUT /users/{userId}`** - Atualizar usuário
  - Permite atualizar: `name`, `is_seller`
  - Retorna: `204 No Content`

---

#### **2. Sistema de Follow (Seguir)**

**`POST /users/{userId}/follow/{sellerId}`** - Seguir vendedor
- **Validações:**
  - Usuário não pode seguir a si mesmo
  - Ambos os usuários devem existir
  - Seller deve ter `IsSeller = true`
  - Não permite seguir o mesmo vendedor duas vezes
- **Retorna:** `201 Created` com mensagem de sucesso

**`PUT /users/{userId}/follow/{sellerId}`** - Deixar de seguir
- Remove o relacionamento de follow
- **Retorna:** `204 No Content`

---

#### **3. Listagem de Seguidores e Seguidos**

**`GET /users/{userId}/followers/count`** - Contar seguidores
- Retorna quantidade de seguidores de um vendedor
- **Retorna:** `200 OK` com `{"followers_count": N}`

**`GET /users/{userId}/followers/list?order=name_asc|name_desc`** - Listar seguidores
- Lista todos os seguidores de um vendedor
- **Ordenação:** Por nome (ascendente ou descendente)
- **Retorna:** `200 OK` com array de usuários

**`GET /users/{userId}/followed/list?order=name_asc|name_desc`** - Listar seguidos
- Lista todos os vendedores que um usuário está seguindo
- **Ordenação:** Por nome (ascendente ou descendente)
- **Retorna:** `200 OK` com array de usuários

---

#### **4. Feed de Publicações**

**`GET /products/followed/{userId}/list?order=date_asc|date_desc&weeks=N`** - Feed de seguidos
- Retorna publicações dos vendedores seguidos
- **Parâmetros:**
  - `order`: Ordenação por data (`date_asc` ou `date_desc`)
  - `weeks`: Quantidade de semanas para filtrar (padrão: 2)
- **Filtro Temporal:** Apenas posts das últimas N semanas
- **Retorna:** `200 OK` com lista de posts

---

### Módulo de Posts (`internal/post`)

#### **1. Publicação de Produtos**

**`POST /products/publish`** - Publicar produto normal
- **Payload:**
  ```json
  {
    "user_id": 1,
    "date": "02-01-2025",
    "product": {
      "product_id": 101,
      "product_name": "Notebook",
      "type": "Eletrônicos",
      "brand": "Dell"
    },
    "category": 1,
    "price": 3500.00,
    "has_promo": false
  }
  ```
- **Validações:**
  - Usuário deve existir e ser seller
  - Nome do produto obrigatório
  - Preço deve ser maior que zero
- **Retorna:** `201 Created` com dados do post criado

---

#### **2. Publicação Promocional**

**`POST /products/promo-pub`** - Publicar produto em promoção
- **Payload:**
  ```json
  {
    "user_id": 1,
    "product": {
      "name": "Smartphone",
      "type": "Eletrônicos"
    },
    "category": "Eletrônicos",
    "price": 2000.00,
    "has_promo": true,
    "discount": 0.15,
    "date": "2025-01-15"
  }
  ```
- **Validações:**
  - `has_promo` deve ser `true`
  - `discount` deve estar entre 0 e 1 (ex: 0.15 = 15%)
  - Data no formato `YYYY-MM-DD` ou `DD-MM-YYYY`
- **Retorna:** `201 Created` com mensagem de sucesso

---

#### **3. Listagem de Promoções**

**`GET /products/promo-pub/list?user_id={sellerId}`** - Listar promoções de um vendedor
- Retorna todas as publicações promocionais (`has_promo = true`) de um seller
- **Retorna:** `200 OK` com lista de posts promocionais

**`GET /sellers/{sellerId}/promotions/count`** - Contar promoções
- Retorna quantidade de publicações promocionais de um vendedor
- **Retorna:** `200 OK` com `{"seller_id": N, "promo_count": M}`

---

## 🔧 Tecnologias e Dependências

### Stack Tecnológico

- **Linguagem:** Go 1.25.5
- **Framework HTTP:** Chi Router v5
- **ORM:** GORM v1.25.7
- **Banco de Dados:** PostgreSQL
- **Documentação:** Swagger/OpenAPI (via swaggo)
- **Containerização:** Docker e Docker Compose

### Principais Bibliotecas

```go
require (
    github.com/go-chi/chi/v5          // Router HTTP
    github.com/swaggo/http-swagger/v2 // Swagger UI
    gorm.io/driver/postgres           // Driver PostgreSQL
    gorm.io/gorm                      // ORM
)
```

---

## 📡 Endpoints da API

### Base URL
```
http://localhost:8080
```

### Rotas Disponíveis

#### **Usuários**
- `POST   /users` - Criar usuário
- `GET    /users` - Listar usuários
- `GET    /users/{userId}` - Buscar usuário
- `PUT    /users/{userId}` - Atualizar usuário

#### **Follow**
- `POST   /users/{userId}/follow/{sellerId}` - Seguir vendedor
- `PUT    /users/{userId}/follow/{sellerId}` - Deixar de seguir

#### **Seguidores**
- `GET    /users/{userId}/followers/count` - Contar seguidores
- `GET    /users/{userId}/followers/list?order=name_asc|name_desc` - Listar seguidores

#### **Seguidos**
- `GET    /users/{userId}/followed/list?order=name_asc|name_desc` - Listar seguidos
- `GET    /users/{userId}/following/list` - Alias para seguidos

#### **Feed**
- `GET    /products/followed/{userId}/list?order=date_asc|date_desc&weeks=N` - Feed de seguidos
- `GET    /products/followed/latest/{userId}` - Alias para feed

#### **Produtos**
- `POST   /products/publish` - Publicar produto
- `POST   /products/promo-pub` - Publicar promoção
- `GET    /products/promo-pub/list?user_id={sellerId}` - Listar promoções

#### **Métricas**
- `GET    /sellers/{sellerId}/promotions/count` - Contar promoções

#### **Documentação**
- `GET    /swagger/*` - Interface Swagger UI

---

## 🎨 Padrões de Design Implementados

### 1. **Clean Architecture**
- Separação clara entre camadas (Domain, Application, Infrastructure)
- Independência de frameworks e bancos de dados
- Regras de negócio isoladas no domínio

### 2. **Repository Pattern**
- Abstração da camada de persistência
- Interfaces definidas no domínio
- Implementações concretas na infraestrutura

### 3. **Dependency Injection**
- Serviços recebem dependências via construtores
- Facilita testes e manutenção

### 4. **DTO Pattern**
- Separação entre modelos de domínio e modelos de API
- Transformações via funções `toUserResponse()`, `toPostResponse()`

### 5. **Service Layer**
- Lógica de negócio centralizada em serviços
- Validações e regras de negócio nos serviços

---

## 🔍 Fluxo de Requisição

### Exemplo: Seguir um Vendedor

```
1. Cliente → POST /users/1/follow/2
   ↓
2. Router (Chi) → UserHandlers.FollowUser()
   ↓
3. Handler → FollowService.Execute()
   ↓
4. Service → Validações de negócio
   - Usuário existe?
   - Seller existe?
   - É seller?
   - Já está seguindo?
   ↓
5. Service → UserRepository.CreateFollow()
   ↓
6. Repository → GORM → PostgreSQL
   ↓
7. Resposta → 201 Created
```

---

## ⚙️ Configuração e Ambiente

### Variáveis de Ambiente

```bash
PORT=8080                    # Porta do servidor
DB_HOST=localhost            # Host do PostgreSQL
DB_PORT=5432                 # Porta do PostgreSQL
DB_USER=socialmeli           # Usuário do banco
DB_PASSWORD=socialmeli       # Senha do banco
DB_NAME=socialmeli           # Nome do banco
DB_SSLMODE=disable           # SSL mode
```

### Migrações

A API utiliza **AutoMigrate** do GORM para criar/atualizar tabelas automaticamente:
- `users` - Tabela de usuários
- `follows` - Tabela de relacionamentos
- `posts` - Tabela de publicações

---

## 🚀 Possíveis Melhorias

### 1. **Segurança e Autenticação**
- ✅ **Implementar autenticação JWT**
- ✅ **Adicionar autorização baseada em roles**
- ✅ **Rate limiting** para prevenir abuso
- ✅ **Validação de entrada mais robusta** (usar bibliotecas como `validator`)

### 2. **Performance**
- ✅ **Cache** (Redis) para consultas frequentes (seguidores, contagens)
- ✅ **Paginação** em listagens (atualmente retorna todos os registros)
- ✅ **Índices adicionais** no banco de dados:
  - `posts(user_id, created_at)` para feed
  - `follows(seller_id)` para contagem de seguidores
- ✅ **Otimização de queries** com `SELECT` específicos ao invés de `SELECT *`

### 3. **Funcionalidades**
- ✅ **Sistema de notificações** quando um seller posta
- ✅ **Busca de produtos** por nome, categoria, preço
- ✅ **Filtros avançados** no feed (por categoria, faixa de preço)
- ✅ **Histórico de preços** para promoções
- ✅ **Sistema de avaliações/comentários** nos produtos
- ✅ **Upload de imagens** para produtos

### 4. **Qualidade de Código**
- ✅ **Testes unitários** para serviços e repositórios
- ✅ **Testes de integração** para endpoints
- ✅ **Cobertura de código** mínima de 80%
- ✅ **Linting** mais rigoroso (golangci-lint)
- ✅ **CI/CD** com GitHub Actions

### 5. **Observabilidade**
- ✅ **Logging estruturado** (zerolog, zap)
- ✅ **Métricas** (Prometheus)
- ✅ **Tracing** distribuído (Jaeger)
- ✅ **Health checks** (`/health`, `/ready`)

### 6. **Documentação**
- ✅ **Swagger completo** com exemplos de request/response
- ✅ **Documentação de erros** padronizada
- ✅ **Guia de contribuição**
- ✅ **Diagramas de arquitetura** atualizados

### 7. **Banco de Dados**
- ✅ **Migrations versionadas** (golang-migrate) ao invés de AutoMigrate
- ✅ **Soft delete** implementado corretamente em todas as entidades
- ✅ **Transações** para operações complexas
- ✅ **Backup automático**

### 8. **API Design**
- ✅ **Versionamento de API** (`/v1/users`, `/v2/users`)
- ✅ **HATEOAS** (Hypermedia) para navegação
- ✅ **Padronização de respostas de erro**
- ✅ **Suporte a CORS** configurável

### 9. **Validações**
- ✅ **Validação de formato de data** mais robusta
- ✅ **Validação de desconto** (0 < discount < 1)
- ✅ **Validação de preço** (não negativo)
- ✅ **Sanitização de inputs** (XSS prevention)

### 10. **Arquitetura**
- ✅ **Event-driven** para notificações (message queue)
- ✅ **Microserviços** se necessário (separar user-service e post-service)
- ✅ **API Gateway** para roteamento e rate limiting
- ✅ **Circuit breaker** para resiliência

---

## 📈 Métricas e Monitoramento Sugeridos

### Métricas de Negócio
- Número de usuários ativos
- Taxa de conversão de seguidores
- Produtos mais visualizados
- Promoções mais efetivas

### Métricas Técnicas
- Tempo de resposta por endpoint
- Taxa de erro (4xx, 5xx)
- Throughput (requests/segundo)
- Uso de recursos (CPU, memória)

---

## 🐛 Tratamento de Erros

### Códigos HTTP Utilizados

- **200 OK** - Sucesso em operações GET
- **201 Created** - Recurso criado com sucesso
- **204 No Content** - Sucesso sem corpo de resposta
- **400 Bad Request** - Requisição inválida
- **404 Not Found** - Recurso não encontrado
- **422 Unprocessable Entity** - Validação de negócio falhou
- **500 Internal Server Error** - Erro interno do servidor

### Estrutura de Erro Padrão

```json
{
  "error": "mensagem de erro descritiva"
}
```

---

## 📝 Conclusão

A API SocialMeli é uma implementação bem estruturada seguindo princípios de Clean Architecture e DDD. A separação de responsabilidades facilita manutenção e testes. As principais funcionalidades estão implementadas, mas há espaço significativo para melhorias em segurança, performance e funcionalidades adicionais.

**Pontos Fortes:**
- ✅ Arquitetura limpa e organizada
- ✅ Separação de responsabilidades clara
- ✅ Código legível e manutenível
- ✅ Documentação Swagger disponível

**Áreas de Melhoria Prioritárias:**
1. Autenticação e autorização
2. Testes automatizados
3. Paginação e cache
4. Validações mais robustas

---

**Documento gerado em:** Janeiro 2025  
**Versão da API:** 1.0  
**Tecnologia:** Go 1.25.5 + PostgreSQL + GORM
