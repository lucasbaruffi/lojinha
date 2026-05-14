-- INSERE CLIENTE

INSERT INTO clientes (
    nome,
    cpf,
    email,
    dt_nascimento,
    endereco
)
VALUES (
    'Lucas Gatão',
    '47940028923',
    'lucas-examples@email.com',
    '2000-04-20',
    'Jaraguá do Sul - SC, ainda na casa dos meus pais'
);


-- INSERIR PEDIDO
INSERT INTO pedidos (id_cliente)
VALUES (1);

-- INSERIR ITEM
INSERT INTO item_pedido (
    id_pedido,
    nome,
    valor_unitario,
    quantidade
)
VALUES (
    1,
    'Palheta Dário',
    0.5,
    15
);

-- APAGAR TODA A TABELA (NA ORDEM CERTA)

DROP TABLE item_pedido;
DROP TABLE pedidos;
DROP TABLE clientes;

-- OU

DROP TABLE IF EXISTS item_pedido, pedidos, clientes CASCADE;

-- CASCADE é "e as dependências junto"