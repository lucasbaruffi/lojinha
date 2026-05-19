async function carregarClientes() {
    `Mostra clientes na caixa de select`
    const resposta = await fetch("/api/clientes");

    const clientes = await resposta.json();
    const select = document.getElementById("cliente");

    for (const cliente of clientes) {
        select.innerHTML += `
            <option value="${cliente.id}">
                ${cliente.nome}
            </option>
        `;
    }
}

carregarClientes(); // Executa quando abre a página


function adicionarItem() {

    const lista = document.getElementById("lista-itens");
    lista.innerHTML += `

        <div class="item-pedido">

            <label>Nome</label>
            <input type="text" class="item-nome">

            <label>Quantidade</label>
            <input type="number" class="item-quantidade">

            <label>Valor</label>
            <input type="number" step="0.01" class="item-valor">

            <hr>

        </div>
    `;
}

adicionarItem();

function obterItens() {
    const elementosItens =
        document.querySelectorAll(".item-pedido");

    const itens = [];

    for (const elemento of elementosItens) {
        const nome =
            elemento.querySelector(".item-nome").value;
        const quantidade =
            elemento.querySelector(".item-quantidade").value;
        const valor =
            elemento.querySelector(".item-valor").value;

        itens.push({
            nome: nome,
            quantidade: Number(quantidade),
            valorUnitario: Number(valor)
        });
    }
    return itens;
}

const formPedido =
    document.getElementById("form-pedido");

formPedido.addEventListener(
    "submit",

    async function (event) {

        event.preventDefault();

        const pedido = {
            idCliente: Number(
                document.getElementById("cliente").value
            ),
            itens: obterItens()
        };

        const resposta = await fetch("/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (resposta.ok) {
            alert("Pedido criado com sucesso!");
            location.reload();
        }
        else {
            const erro = await resposta.json();
            alert(erro.mensagem);
        }
    }
);