-- Esse arquivo é utilizado para a criação do banco de dados no PostgreSQL.

CREATE TABLE clientes (
 id SERIAL PRIMARY KEY,
 nome VARCHAR(255) NOT NULL,
 cpf VARCHAR(14) UNIQUE NOT NULL
);
