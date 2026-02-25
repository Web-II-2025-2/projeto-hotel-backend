# Fluxo de Execução

O nosso fluxo principal é a criação de uma reserva juntamente, desde o começo até o check-out e o quarto voltar a ficar apto a ser reservado mais uma vez.

## Criação das contas e Autenticação

1. Autenticação do Admin: Login inicial para obter o token de administrador.

2. Gestão de Usuários (Gerente/Funcionário/Hóspede):

3. Criação de um Gerente (register-manager).

4. Login com o novo Gerente para obter o token específico (auth_token_manager).

5. Criação de um Funcionário pelo Gerente.

6. Login com o Funcionário para obter o token de staff (auth_token_employee).

7. Cadastro de um Hóspede (register-guest).

## Ciclo do Quarto e Reserva:

1. Criação: Cadastro de um novo quarto físico no sistema.

2. Consulta: Verificação de quartos disponíveis.

3. Reserva: Criação de uma reserva para o hóspede (POST /reservations).

## Operacional:

1. Check-in: Ativação da reserva.

2. Check-out: Finalização da estadia (o status do quarto muda para "sujo").

3. Limpeza: O funcionário realiza a limpeza.

4. Disponibilidade: Verificação final mostrando que o quarto voltou ao estado "disponível".


<video src="./main-fluxo.webm" controls="controls" width="100%">
</video>