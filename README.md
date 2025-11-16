# Alunos

- Arthur Gabriel Santos Albuquerque
- Victor Vili Xavier Luna
# Projeto: Sistema de Gestão Hoteleira
Este projeto é um sistema de gerenciamento focado em automatizar e otimizar as operações diárias de um hotel. A plataforma centraliza desde a reserva de quartos até o fechamento da conta do hóspede, garantindo controle total sobre o inventário, finanças e logística operacional.

O objetivo é criar uma plataforma robusta que reduza o trabalho manual da recepção, otimize a taxa de ocupação através de um controle de inventário preciso e melhore a experiência do hóspede ao agilizar os processos de check-in e check-out.

# Funcionalidades Principais

## 1. Módulo: Gerência de quartos 
### Funcionalidades:
- Cadastrar quartos: O sistema deve permitir o cadastro de quartos e associá-los a um "Tipo de Quarto" e a um valor de diária.
- Gerenciamento de Estado: O sistema deve permitir que um quarto transite por diferentes estados: Disponível, Ocupado, Em Limpeza, Em Manutenção.
- Tipos de Quarto: O sistema deve permitir o cadastro de "Tipos de Quarto" (ex: Standard Casal, Suíte Deluxe) e quantos quartos físicos existem para cada tipo.
- Bloqueio de Quarto: Um funcionário deve poder colocar um quarto em um estado de limpeza ou em manutenção retirando o quarto de ser possível de reservar.

## 2. Módulo: Gestão de funcionários 

### Objetivo: Garantir que cada funcionário só acesse o que é responsabilidade da sua função.

### Funcionalidades:

- Cadastro de Funcionários: O sistema deve permitir o cadastro de usuários e senhas.

- Perfis de Acesso (Roles): O sistema deve ter perfis pré-definidos (ex: Gerente, Recepcionista, Camareira, Restaurante).

## 3. Módulo: Gestão de Hóspedes

### Objetivo: Manter um histórico e reconhecer clientes recorrentes.
### Funcionalidades:

- Cadastro de Hóspedes: O sistema deve manter um cadastro de hóspedes, contendo dados pessoais e de contato.
- Histórico de Estadias: O sistema deve associar todas as reservas de um hóspede ao seu cadastro.

## 4. Módulo: Reservas

### Objetivo: Garantir a venda de estadias de forma segura e controlada.

### Funcionalidades:
- Consulta de Disponibilidade: O sistema deve permitir a consulta de "Tipos de Quarto" disponíveis para um determinado período e número de hóspedes.

- Criação de Reserva: O sistema deve permitir a criação de uma reserva associada a um "Tipo de Quarto" e a um cadastro de Hóspede.
- Confirmação/Cancelamento: O sistema deve confirmar a reserva se o pagamento for bem-sucedido ou liberar a vaga se o tempo expirar ou o pagamento falhar.

## 5. Módulo: Gestão de Eventos

### Objetivo: Gerenciar a reserva de espaços e serviços além dos quartos.

### Funcionalidades:
- Cadastro de Ativos (Eventos): O sistema deve permitir o cadastro de "Espaços" e "Eventos" (ex: "Projetor", "Coffee Break por pessoa").
- Calendário de Eventos: O sistema deve fornecer uma visão de calendário para a disponibilidade desses "Espaços".
- Agendamento de Eventos: O sistema deve permitir a reserva de um espaço, anexando os serviços necessários.
- Notificação de Eventos: Se for um evento organizado pelo o hotel, o sistema deve notificar os hóspedes a participar. 

## 6. Módulo: Operações e Limpeza

### Objetivo: Coordenar a logística de limpeza e preparação dos quartos.

### Funcionalidades:
- Fila de Limpeza Automática: Quando um hóspede faz check-out, o sistema deve automaticamente mudar o estado do quarto para Disponível Sujo e adicioná-lo à fila de trabalho da equipe de limpeza.
- Atualização de Status: A equipe de limpeza deve poder marcar um quarto como Em Limpeza e, ao finalizar, como Disponível Limpo.

# Características de qualidade

## Segurança

- O sistema irá manipular dados sensíveis de usuários (hóspedes e funcionários).
- Deve haver múltiplos níveis de acesso, com um mecanismo de RBAC robusto e bem definido.

## Usabilidade

- O sistema será utilizado por funcionários com diferentes níveis de conhecimento técnico.
- A interface também deve ser intuitiva para os hóspedes, garantindo facilidade de uso e entendimento.

## Confiabilidade 

- O sistema não pode apresentar falhas durante operações críticas, como check-in e check-out
- Dados financeiros e operacionais não podem ser perdidos, exigindo mecanismos de recuperação e alta disponibilidade.