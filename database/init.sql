-- Esse arquivo é utilizado para a criação do banco de dados no PostgreSQL.

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    dt_nascimento DATE NOT NULL,
    endereco VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    dt_pedido TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT fk_id_cliente        -- Cria a regra "fk_id_cliente"
        FOREIGN KEY (id_cliente)    -- Diz que o id_cliente é chave estrangeira
        REFERENCES clientes(id)     -- E só pode existir se estiver em clientes(id)
);

CREATE TABLE IF NOT EXISTS item_pedido (
    id SERIAL PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 0, -- Até 10 dígitos, sendo 2 casas decimais
    quantidade INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT fk_id_pedido         -- Cria a regra "fk_id_pedido"
        FOREIGN KEY (id_pedido)     -- Diz que o id_pedido é chave estrangeira
        REFERENCES pedidos(id),     -- E só pode existir se se estiver em pedidos(id)

    CHECK (quantidade > 0),
    CHECK (valor_unitario >= 0)
);