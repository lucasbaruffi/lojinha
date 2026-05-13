# Objetivo:

Desenvolver uma aplicação simples para gerenciar pedidos e clientes, com funcionalidades de cadastro, consulta e regras de negócio.

## Tecnologias:

- Preferencialmente C# (ou escolha a linguagem de sua preferência).
- Banco de dados SQL (SQL Server, MySQL, PostgreSQL, etc., conforme preferência do candidato).

## Requisitos do Sistema

### 1. Cadastro de Clientes
Campos obrigatórios: Nome, Email, Data de Nascimento, CPF, Endereço.

Validações:

1. CPF deve ser único e válido.
2. Email deve ter um formato válido.
3. Data de nascimento deve indicar idade maior ou igual a 18 anos.


### 2. Cadastro de Pedidos
Cada pedido pertence a um cliente.  
Um pedido deve ter pelo menos um item.  
O cliente pode ter vários pedidos.  

Campos obrigatórios: Cliente, Data do Pedido, Valor Total.

Regras de negócio:
1. O valor total do pedido deve ser calculado com base nos itens do pedido.
2. Um pedido não pode ser alterado após 24 horas de sua criação.



### 3. Consulta de Pedidos
- Permitir listar pedidos filtrando por nome do cliente ou intervalo de datas.  
- Exibir detalhes do pedido, incluindo os itens e valores.  
- Exibir o total gasto pelo cliente em pedidos.  

### 4. Banco de Dados
- Criar as tabelas necessárias para suportar as funcionalidades.
- A estrutura do banco e a forma de acesso aos dados ficam a critério do candidato.

### 5. Publicação da Aplicação 
- O candidato deve publicar a aplicação em um ambiente acessível 


## Entrega
- Código-fonte organizado e comentado.
- Script SQL para criação das tabelas.
- Link para a aplicação publicada