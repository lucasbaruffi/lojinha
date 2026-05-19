document.addEventListener("DOMContentLoaded", () => {

    const select = document.getElementById("cliente");
    const listaItens = document.getElementById("lista-itens");
    const formPedido = document.getElementById("form-pedido");
    const listaPedidosDiv = document.getElementById("lista-pedidos");
    const btnNovoPedido = () => document.getElementById('btn-novo-pedido');
    const btnCancelarPedido = () => document.getElementById('btn-cancelar-pedido');

    async function carregarClientes() {
        const resposta = await fetch("/api/clientes");
        const clientes = await resposta.json();

        select.innerHTML = "";
        select.innerHTML += `<option value="">-- selecione --</option>`;
        for (const cliente of clientes) {
            select.innerHTML += `
                <option value="${cliente.id}">
                    ${cliente.nome}
                </option>
            `;
        }
    }

    function adicionarItem() {
        const item = document.createElement("div");
        item.className = "item-pedido";
        item.innerHTML = `
            <label>Nome</label>
            <input type="text" class="item-nome">

            <label>Quantidade</label>
            <input type="number" class="item-quantidade">

            <label>Valor</label>
            <input type="number" step="0.01" class="item-valor">

            <button type="button" class="remover-item">Remover</button>
            <hr>
        `;

        item.querySelector('.remover-item').addEventListener('click', () => {
            item.remove();
        });

        listaItens.appendChild(item);
    }

    function obterItens() {
        const elementosItens = document.querySelectorAll(".item-pedido");
        const itens = [];

        for (const elemento of elementosItens) {
            const nome = elemento.querySelector(".item-nome").value;
            const quantidade = elemento.querySelector(".item-quantidade").value;
            const valor = elemento.querySelector(".item-valor").value;

            if (!nome) continue;

            itens.push({
                nome: nome,
                quantidade: Number(quantidade) || 0,
                valorUnitario: Number(valor) || 0
            });
        }
        return itens;
    }

    async function criarPedido(pedido) {
        const resposta = await fetch("/api/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        if (resposta.ok) {
            mostrarMensagem("Pedido criado com sucesso!");
            formPedido.reset();
            listaItens.innerHTML = "";
            adicionarItem();
            carregarPedidos();
            // esconder o form após criar
            formPedido.classList.add('hidden');
        } else {
            const erro = await resposta.json();
            mostrarMensagem(erro.mensagem || 'Erro ao criar pedido');
        }
    }

    function mostrarMensagem(texto) {
        alert(texto);
    }

    formPedido.addEventListener("submit", async function (event) {
        event.preventDefault();

        const pedido = {
            idCliente: Number(select.value),
            itens: obterItens()
        };

        if (!pedido.idCliente) {
            mostrarMensagem("Selecione um cliente");
            return;
        }

        if (pedido.itens.length === 0) {
            mostrarMensagem("Adicione pelo menos um item com nome");
            return;
        }

        await criarPedido(pedido);
    });

    async function carregarPedidos() {
        const resposta = await fetch('/api/pedidos');
        const pedidos = await resposta.json();

        if (!listaPedidosDiv) return;

        listaPedidosDiv.innerHTML = '';

        if (pedidos.length === 0) {
            listaPedidosDiv.innerText = 'Nenhum pedido cadastrado.';
            return;
        }

        const table = document.createElement('table');
        table.className = 'tabela-pedidos';
        table.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Cliente (ID)</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Ações</th>
            </tr>
        `;

        for (const pedido of pedidos) {
            const total = (pedido.itens || []).reduce((acc, it) => acc + (it.quantidade * it.valorUnitario), 0);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.idCliente}</td>
                <td>${(pedido.itens || []).length}</td>
                <td>R$ ${total.toFixed(2)}</td>
                <td>
                    <button class="button-view" data-id="${pedido.id}">Ver</button>
                    <button class="button-delete" data-id="${pedido.id}">Excluir</button>
                </td>
            `;

            tr.querySelector('.button-delete').addEventListener('click', () => excluirPedido(pedido.id));
            tr.querySelector('.button-view').addEventListener('click', () => verPedido(pedido.id));

            table.appendChild(tr);
        }

        listaPedidosDiv.appendChild(table);
    }

    async function excluirPedido(id) {
        if (!confirm('Deseja realmente excluir este pedido?')) return;
        const resposta = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
        if (resposta.ok) {
            mostrarMensagem('Pedido removido com sucesso!');
            carregarPedidos();
        } else {
            const erro = await resposta.json();
            mostrarMensagem(erro.mensagem || 'Erro ao remover pedido');
        }
    }

    async function verPedido(id) {
        const resposta = await fetch(`/api/pedidos/${id}`);
        if (!resposta.ok) {
            mostrarMensagem('Pedido não encontrado');
            return;
        }
        const pedido = await resposta.json();

        let texto = `Pedido ${pedido.id} - Cliente ${pedido.idCliente}\n`;
        texto += 'Itens:\n';
        for (const it of (pedido.itens || [])) {
            texto += `- ${it.nome} x${it.quantidade} @ R$ ${it.valorUnitario.toFixed(2)}\n`;
        }
        texto += `Total: R$ ${(pedido.itens || []).reduce((a,b)=>a+(b.quantidade*b.valorUnitario),0).toFixed(2)}`;

        alert(texto);
    }

    // Inicialização
    carregarClientes();
    adicionarItem();
    carregarPedidos();

    // Esconder form de pedido por padrão e configurar botões
    formPedido.classList.add('hidden');
    const btnNovo = btnNovoPedido();
    const btnCancelar = btnCancelarPedido();
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            formPedido.reset();
            listaItens.innerHTML = '';
            adicionarItem();
            select.disabled = false;
            formPedido.classList.remove('hidden');
            formPedido.scrollIntoView({behavior:'smooth'});
        });
    }
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            formPedido.reset();
            listaItens.innerHTML = '';
            adicionarItem();
            formPedido.classList.add('hidden');
        });
    }

    // se houver parâmetro cliente na URL, selecionar e travar
    const parametros = new URLSearchParams(window.location.search);
    const idCliente = parametros.get('cliente');
    if (idCliente) {
        // aguarda carregar clientes para selecionar o valor
        const trySelect = setInterval(() => {
            if (select.options.length > 1) {
                select.value = idCliente;
                select.disabled = true;
                clearInterval(trySelect);
            }
        }, 100);
    }

    // expõe adicionarItem no escopo global para o botão inline
    window.adicionarItem = adicionarItem;

});