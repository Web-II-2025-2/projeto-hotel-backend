# Documento de Testes Ponta a Ponta (E2E)
## Sistema de Gestão Hoteleira

---

## 1. Objetivo

Este documento descreve os **cenários de testes ponta a ponta (End-to-End)** do Sistema de Hotel.

Os testes E2E têm como objetivo validar **fluxos completos de negócio**, garantindo que múltiplos módulos do sistema funcionem corretamente de forma integrada, simulando o comportamento real dos usuários (hóspedes, funcionários e gerentes).

---

## 2. Escopo dos Testes

Os testes E2E cobrem:

- Autenticação e autorização
- Gestão de usuários, funcionários e hóspedes
- Controle de papéis e permissões (RBAC)
- Reservas e alocação de quartos
- Eventos e serviços
- Checkout e fluxo operacional de limpeza
- Cancelamentos e liberação de recursos

---

## 3. Papéis do Sistema (Roles)

- **Hóspede**
- **Funcionário**
- **Gerente**
- **Admin**

---

## 4. Cenários de Teste Ponta a Ponta

---

### CT-E2E-01 — Atribuição do papel de gerente a um usuário

**Objetivo:**  
Validar o fluxo de cadastro e atribuição de credencial de gerente a um usuário.

**Pré-condições:**
- Admin criado no sistema

**Fluxo:**
1. Usuário realiza registro
2. Admin atribui o papel de gerente ao usuário

**Pós-condições:**
- Usuário possui papel de gerente
- Alteração de papel registrada no sistema

---

### CT-E2E-02 — Criação de quarto por gerente

**Objetivo:**  
Validar a criação de quartos por um gerente.

**Pré-condições:**
- Usuário criado e com credencial de gerente

**Fluxo:**
1. Gerente realiza login
2. Gerente cria um novo quarto

**Pós-condições:**
- Quarto persistido no sistema
- Quarto com status definido no momento de criação

---

### CT-E2E-03 — Cadastro de funcionário com aprovação do gerente

**Objetivo:**  
Garantir que funcionários só possam ser cadastrados mediante aprovação de um gerente ou papel superior.

**Pré-condições:**
- Gerente autenticado no sistema

**Fluxo:**
1. Usuário cadastra-se
2. Gerente confere a credencial de funcionário ao usuário
3. Gerente define o papel inicial do funcionário

**Pós-condições:**
- Funcionário registrado no sistema
- Funcionário com papel atribuído

---

### CT-E2E-04 — Registro de hóspede e criação de reserva aceita por um funcionário

**Objetivo:**  
Validar o fluxo completo de reserva por um hóspede.

**Pré-condições:**
- Quarto disponível
- Hóspede não registrado previamente

**Fluxo:**
1. Hóspede se registra
2. Hóspede realiza login
3. Consulta disponibilidade
4. Cria reserva válida
5. Funcionário confirma reserva

**Pós-condições:**
- Reserva registrada no sistema
- Reserva associada ao hóspede
- Quarto com status "Reservado"

---

### CT-E2E-05 — Tentativa de reserva em período indisponível

**Objetivo:**  
Impedir reservas conflitantes.

**Pré-condições:**
- Quarto já reservado no período solicitado

**Fluxo:**
1. Hóspede realiza login
2. Tenta criar reserva para período indisponível

**Pós-condições:**
- Nenhuma nova reserva criada
- Estado do quarto permanece inalterado

---

### CT-E2E-06 — Participação de hóspede em evento

**Objetivo:**  
Validar inscrição de hóspede em evento.

**Pré-condições:**
- Evento ativo e com capacidade disponível

**Fluxo:**
1. Hóspede realiza login
2. Consulta eventos disponíveis
3. Realiza inscrição
4. Funcionário ou credencial maior aceita inscrição

**Pós-condições:**
- Hóspede associado ao evento
- Vagas do evento atualizadas

---

### CT-E2E-07 — Alocação de serviço 

**Objetivo:**  
Validar prestação de serviços a um quarto.

**Pré-condições:**
- Funcionário prestador cadastrado
- Gerente autenticado
- Quarto ativo

**Fluxo:**
1. Prestador solicita alocação de serviço
2. Status do quarto é atualizado

**Pós-condições:**
- Serviço associado ao quarto

---

### CT-E2E-08 — Checkout e fluxo automático de limpeza

**Objetivo:**  
Garantir rapidez e disponibilidade do quarto após checkout.

**Pré-condições:**
- Reserva ativa associada a um quarto

**Fluxo:**
1. Hóspede realiza checkout
2. Sistema altera o quarto para "DIRTY"
3. É solicitado a um funcionário limpar o quarto

**Pós-condições:**
- Reserva finalizada
- Quarto com status atualizado

---

### CT-E2E-09 — Cancelamento de reserva e liberação do quarto

**Objetivo:**  
Garantir liberação de recursos após cancelamento.

**Pré-condições:**
- Reserva válida dentro do prazo permitido

**Fluxo:**
1. Hóspede cancela reserva

**Pós-condições:**
- Reserva cancelada
- Quarto liberado para novas reservas

---

## 5. Critérios de Aceitação

- Fluxos devem respeitar autenticação e autorização
- Papéis devem ser validados em todas as operações sensíveis
- Estados do sistema devem permanecer consistentes
- Nenhuma operação crítica deve gerar dados inválidos

---
