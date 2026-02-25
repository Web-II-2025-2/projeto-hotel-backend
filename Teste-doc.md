# Documento de Testes End-to-End (E2E)
**Sistema de Gestão de Hóteis**

Este documento descreve os cenários de testes end-to-end responsáveis por validar os fluxos críticos do sistema, incluindo autenticação, permissões, reservas, eventos e manutenção de quartos.

---

## CT-E2E-01: Ciclo de Permissões – Promoção de Usuário

### Descrição
Valida o fluxo onde um usuário guest tenta executar uma ação restrita, falha por permissão insuficiente, é promovido a manager e passa a executar a ação com sucesso.

### Pré-condições
- Administrador inicial criado no sistema  

### Fluxo
1. Registrar um novo usuário guest  
2. Autenticar como guest  
3. Guest tenta registrar um employee e falha por não ter permissão
4. Administrador promove o guest para MANAGER  
5. Autenticar novamente como manager  
6. Manager registra com sucesso um employee 

### Pós-condições
- Usuário promovido possui permissões de manager 

---

## CT-E2E-02: Ciclo Completo de Hospedagem

### Descrição
Valida o fluxo principal de negócio: consulta de quartos disponíveis, criação de reserva, check-in, check-out e verificação de quartos sujos.

### Pré-condições
- Administrador autenticado  
- Pelo menos um quarto criado  

### Fluxo
1. Registrar usuário guest  
2. Autenticar como guest  
3. Consultar quartos disponíveis 
4. Criar reserva 
5. Realizar check-in → Status CHECKED_IN 
6. Realizar check-out → Status CHECKED_OUT
7. Administrador consulta quartos sujos e o quarto recém desocupado aparece 

### Pós-condições
- Reserva finalizada  
- Quarto marcado como DIRTY  

---

## CT-E2E-03: Reserva em Quarto Ocupado

### Descrição
Garante que o sistema impeça reservas concorrentes em um mesmo quarto e período, liberando-o após cancelamento.

### Pré-condições
- Administrador autenticado  
- Quarto criado  
- Dois usuários guest registrados  

### Fluxo
1. Usuário 1 cria reserva  
2. Usuário 2 tenta reservar mesmo quarto/período e falha por conflito
3. Usuário 1 cancela reserva 
4. Usuário 2 tenta novamente e deve ter sucesso 

### Pós-condições
- Reserva válida associada ao Usuário 2  

---

## CT-E2E-04: Ciclo de Status e Limpeza de Quarto

### Descrição
Valida as transições de estado do quarto após checkout e o fluxo de limpeza.

### Pré-condições
- Administrador autenticado 
- Quarto criado  
- Dois usuários guest registrados  
- Reserva ativa para Usuário 1  

### Fluxo
1. Usuário 1 realiza check-in  
2. Usuário 1 realiza check-out  
3. Usuário 2 consulta quartos disponíveis e não deve ter o quarto sujo
4. Administrador consulta quartos sujos  
5. Administrador limpa quarto
6. Usuário 2 consulta quartos disponíveis e deve ter o quarto recém-limpo
7. Usuário 2 cria reserva 

### Pós-condições
- Quarto disponível para novas reservas  
- Nova reserva criada  

---

## CT-E2E-05: Evento Lotado

### Descrição
Valida o controle de capacidade de eventos, impedindo inscrições além do limite.

### Pré-condições
- Administrador autenticado  
- Dois usuários guest registrados  

### Fluxo
1. Criar evento com capacidade = 1 
2. Usuário 1 participa   
3. Usuário 2 tenta participar e falha por lotação  

### Pós-condições
- Evento com capacidade esgotada  

---