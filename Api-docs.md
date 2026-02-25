# Documentação da API

## Visão geral do projeto

API REST para gestão hoteleira com autenticação JWT, controle de permissões por papéis (RBAC), gerenciamento de hóspedes, funcionários, quartos, reservas e eventos.

### Funcionalidades principais
- **Autenticação e autorização** com login, emissão de token e validação por papel (ADMIN, MANAGER, EMPLOYEE, GUEST).
- **Cadastro e gestão de usuários** (hóspedes e funcionários).
- **Gestão de quartos** com estados operacionais (`AVAILABLE`, `OCCUPIED`, `DIRTY`, etc.).
- **Gestão de reservas** com cálculo automático de preço total, prevenção de conflitos de agenda e fluxo de check-in/check-out.
- **Gestão de eventos** com capacidade limitada e controle de inscrições.
- **Proteções transversais**: validação com Zod, rate limit, logs e middleware global de erros.

---

## Regras globais de autenticação, autorização e erros

### 1) Autenticação
- A rota `POST /auth/login` e `POST /auth/register-guest` são públicas.
- Demais rotas exigem `Authorization: Bearer <token>`.
- Erros comuns:
  - **401**: token ausente (`Access denied. No token provided.`)
  - **401**: token inválido/expirado (`Invalid or expired token.`)

### 2) Autorização (RBAC)
- O sistema aplica níveis de acesso por rota.
- Se o papel do usuário não estiver na lista permitida da rota, retorna:
  - **403**: `Access denied. You do not have permission to perform this action.`

### 3) Validação de payload (Zod)
- Rotas com `validateDTO(...)` retornam:
  - **400**: `Erro de validação: ...`

### 4) Rate limit
- **Geral**: até 100 requests por 15 min por IP.
- **Login**: até 5 tentativas por 30 min por IP (ignora logins bem-sucedidos).
- Excesso retorna:
  - **429**

### 5) Erro interno
- Qualquer erro não tratado como `AppError` retorna:
  - **500**: `Internal server error`

---

## Rotas de Autenticação (`/auth`)

### `POST /auth/login`
- **Acesso**: público
- **Descrição**: autentica usuário por email/senha e retorna token JWT.
- **Sucesso**: **200**
- **Erros**:
  - **401** credenciais inválidas
  - **429** muitas tentativas de login

### `POST /auth/register-guest`
- **Acesso**: público
- **Descrição**: registra um hóspede com credencial `GUEST`.
- **Sucesso**: **201**
- **Erros**:
  - **409** email já em uso
  - **429** limite de tentativas (mesmo limiter aplicado na rota)

### `POST /auth/register-employee`
- **Acesso**: `MANAGER` (inclui ADMIN)
- **Descrição**: registra funcionário com papel `EMPLOYEE`.
- **Sucesso**: **201**
- **Erros**:
  - **401/403** autenticação/permissão
  - **409** email já em uso

### `POST /auth/register-manager`
- **Acesso**: `ADMIN`
- **Descrição**: registra funcionário com papel `MANAGER`.
- **Sucesso**: **201**
- **Erros**:
  - **401/403** autenticação/permissão
  - **409** email já em uso

### `PATCH /auth/role`
- **Acesso**: `MANAGER` (inclui ADMIN)
- **Descrição**: altera papel de outro usuário.
- **Sucesso**: **200**
- **Erros**:
  - **400** tentativa de alterar o próprio papel
  - **403** sem hierarquia suficiente para alterar o papel alvo
  - **404** usuário alvo não encontrado

---

## Rotas de Hóspedes (`/guests`)

### `GET /guests`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: lista todos os hóspedes.
- **Sucesso**: **200**

### `GET /guests/profile`
- **Acesso**: `GUEST`
- **Descrição**: retorna perfil do hóspede autenticado.
- **Sucesso**: **200**
- **Erros**:
  - **404** hóspede não encontrado

### `PUT /guests/profile`
- **Acesso**: `GUEST`
- **Descrição**: atualiza perfil do hóspede autenticado.
- **Sucesso**: **200**
- **Erros**:
  - **400** falha de validação do payload
  - **404** hóspede não encontrado

### `DELETE /guests/profile`
- **Acesso**: `GUEST`
- **Descrição**: remove conta do hóspede autenticado.
- **Sucesso**: **204**
- **Erros**:
  - **404** hóspede não encontrado

---

## Rotas de Funcionários (`/employees`)

### `GET /employees`
- **Acesso**: `MANAGER` (inclui ADMIN)
- **Descrição**: lista funcionários.
- **Sucesso**: **200**

### `GET /employees/:id`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: busca funcionário por ID.
- **Sucesso**: **200**
- **Erros**:
  - **404** funcionário não encontrado

### `PUT /employees/:id`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: atualiza funcionário.
- **Sucesso**: **200**
- **Erros**:
  - **400** falha de validação do payload
  - **404** funcionário não encontrado

### `DELETE /employees/:id`
- **Acesso**: `MANAGER` (inclui ADMIN)
- **Descrição**: remove funcionário.
- **Sucesso**: **204**
- **Erros**:
  - **404** funcionário não encontrado

### `PATCH /employees/:id_room`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: realiza limpeza de quarto (muda de `DIRTY` para `AVAILABLE`).
- **Sucesso**: **200**
- **Erros**:
  - **400** quarto não está marcado para limpeza
  - **404** quarto não encontrado

---

## Rotas de Quartos (`/rooms`)

### `POST /rooms`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: cria quarto.
- **Sucesso**: **201**
- **Erros**:
  - **400** falha de validação do payload
  - **409** número de quarto duplicado

### `GET /rooms`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: lista todos os quartos.
- **Sucesso**: **200**

### `GET /rooms/available`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: lista quartos com status `AVAILABLE`.
- **Sucesso**: **200**

### `GET /rooms/dirty`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: lista quartos com status `DIRTY`.
- **Sucesso**: **200**

### `GET /rooms/:id`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: busca quarto por ID.
- **Sucesso**: **200**
- **Erros**:
  - **404** quarto não encontrado

### `PUT /rooms/:id`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: atualiza quarto.
- **Sucesso**: **200**
- **Erros**:
  - **400** falha de validação do payload
  - **404** quarto não encontrado
  - **409** número de quarto duplicado

### `DELETE /rooms/:id`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: remove quarto.
- **Sucesso**: **204**
- **Erros**:
  - **404** quarto não encontrado

---

## Rotas de Reservas (`/reservations`)

### `POST /reservations`
- **Acesso**: `GUEST`
- **Descrição**: cria reserva para o hóspede autenticado, calcula `totalPrice` e valida conflito de período.
- **Sucesso**: **201**
- **Erros**:
  - **400** falha de validação (ex.: datas inválidas)
  - **404** quarto ou hóspede não encontrado
  - **409** conflito de agenda do quarto

### `GET /reservations`
- **Acesso**: `EMPLOYEE` (inclui MANAGER/ADMIN)
- **Descrição**: lista todas as reservas.
- **Sucesso**: **200**

### `GET /reservations/my-reservations`
- **Acesso**: `GUEST`
- **Descrição**: lista reservas do hóspede autenticado.
- **Sucesso**: **200**
- **Erros**:
  - **404** hóspede não encontrado

### `GET /reservations/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: busca reserva por ID.
- **Sucesso**: **200**
- **Erros**:
  - **404** reserva não encontrada

### `PUT /reservations/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: atualiza reserva e recalcula preço quando datas mudam.
- **Sucesso**: **200**
- **Erros**:
  - **400** validação/datas inválidas/reserva em status não permitido
  - **404** reserva não encontrada
  - **409** conflito de datas para o quarto

### `DELETE /reservations/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: cancela reserva (status `CANCELED`).
- **Sucesso**: **204**
- **Erros**:
  - **404** reserva não encontrada

### `PATCH /reservations/:id/checkin`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: marca check-in da reserva e altera quarto para `OCCUPIED`.
- **Sucesso**: **200**
- **Erros**:
  - **400** fora da janela permitida para check-in
  - **403** reserva não pertence ao hóspede autenticado
  - **404** reserva/hóspede/quarto não encontrado

### `PATCH /reservations/:id/checkout`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: marca check-out da reserva e altera quarto para `DIRTY`.
- **Sucesso**: **200**
- **Erros**:
  - **403** reserva não pertence ao hóspede autenticado
  - **404** reserva/hóspede/quarto não encontrado

---

## Rotas de Eventos (`/events`)

### `POST /events`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: cria evento.
- **Sucesso**: **201**
- **Erros**:
  - **400** campos obrigatórios ausentes

### `GET /events`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: lista eventos.
- **Sucesso**: **200**
- **Erros**:
  - **400** falha ao buscar lista

### `GET /events/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: busca evento por ID.
- **Sucesso**: **200**
- **Erros**:
  - **404** evento não encontrado

### `PUT /events/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: atualiza evento.
- **Sucesso**: **200**
- **Erros**:
  - **404** evento não encontrado

### `DELETE /events/:id`
- **Acesso**: autenticado (`ADMIN|MANAGER|EMPLOYEE|GUEST`)
- **Descrição**: remove evento.
- **Sucesso**: **204**
- **Erros**:
  - **404** evento não encontrado

---
