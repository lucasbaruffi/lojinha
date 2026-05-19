document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("cliente");
    const formTitle = document.getElementById("form-pedido-title");
    const listaPedidosDiv = document.getElementById("lista-pedidos");
    const resumoPedidosDiv = document.getElementById("resumo-pedidos");
    const formPedido = document.getElementById("form-pedido");
    const pedidoItensBody = document.getElementById("pedido-itens-body");
    const pedidoModal = document.getElementById("pedido-modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalInfos = document.getElementById("modal-infos");
    const modalItensBody = document.getElementById("modal-itens-body");
    const modalTotal = document.getElementById("modal-total");
    const btnNovoPedido = document.getElementById('btn-novo-pedido');
    const btnCancelarPedido = document.getElementById('btn-cancelar-pedido');
    const btnAdicionarItem = document.getElementById('btn-adicionar-item');
    const btnLimparFiltro = document.getElementById('btn-limpar-filtro');
    const inputSearch = document.getElementById('search-pedidos');
    const inputFiltroId = document.getElementById('filtro-id');
    const inputFiltroCliente = document.getElementById('filtro-cliente');
    const inputFiltroMin = document.getElementById('filtro-min-total');
    const inputFiltroMax = document.getElementById('filtro-max-total');
    const inputFiltroInicio = document.getElementById('filtro-data-inicio');
    const inputFiltroFim = document.getElementById('filtro-data-fim');

    let pedidosCache = [];
    let clientesCache = [];
    let editMode = false;
    let editingPedidoId = null;
    let itensRemovidos = [];

    function formatarDinheiro(valor) {
        return `R$ ${valor.toFixed(2)}`;
    }

    function getClienteNome(idCliente) {
        const cliente = clientesCache.find(c => c.id === idCliente);
        return cliente ? cliente.nome : `Cliente ${idCliente}`;
    }

    async function carregarClientes() {
        const resposta = await fetch("/api/clientes");
        clientesCache = await resposta.json();

        select.innerHTML = "";
        select.innerHTML += `<option value="">-- selecione --</option>`;
        for (const cliente of clientesCache) {
            select.innerHTML += `\n                <option value="${cliente.id}">${cliente.nome}</option>`;
        }
    }

    function criarLinhaItem(item = { nome: '', quantidade: 1, valorUnitario: 0 }) {
        const tr = document.createElement('tr');
        if (item.id) {
            tr.dataset.itemId = item.id;
        }

        tr.innerHTML = `
            <td><input type="text" class="item-nome" value="${item.nome}"></td>
            <td><input type="number" class="item-quantidade" min="1" value="${item.quantidade}"></td>
            <td><input type="number" class="item-valor" min="0" step="0.01" value="${item.valorUnitario.toFixed(2)}"></td>
            <td><button type="button" class="button-delete btn-remove-item">Remover</button></td>
        `;
        tr.querySelector('.btn-remove-item').addEventListener('click', () => {
            if (editMode && tr.dataset.itemId) {
                itensRemovidos.push(Number(tr.dataset.itemId));
            }
            tr.remove();
        });
        pedidoItensBody.appendChild(tr);
    }

    function obterItensDoFormulario() {
        return Array.from(pedidoItensBody.querySelectorAll('tr')).map(tr => ({
            id: tr.dataset.itemId ? Number(tr.dataset.itemId) : undefined,
            nome: tr.querySelector('.item-nome').value.trim(),
            quantidade: Number(tr.querySelector('.item-quantidade').value) || 0,
            valorUnitario: Number(tr.querySelector('.item-valor').value) || 0
        })).filter(item => item.nome && item.quantidade > 0);
    }

    function atualizarTituloFormulario() {
        formTitle.innerText = editMode ? `Editando Pedido #${editingPedidoId}` : 'Novo Pedido';
    }

    function validarFormulario() {
        if (!select.value) {
            alert('Selecione um cliente.');
            return false;
        }
        const itens = obterItensDoFormulario();
        if (itens.length === 0) {
            alert('Adicione pelo menos um item válido com nome e quantidade.');
            return false;
        }
        return true;
    }

    async function criarPedido(pedido) {
        const resposta = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        if (resposta.ok) {
            alert('Pedido criado com sucesso!');
            formPedido.reset();
            pedidoItensBody.innerHTML = '';
            criarLinhaItem();
            editMode = false;
            editingPedidoId = null;
            itensRemovidos = [];
            atualizarTituloFormulario();
            formPedido.classList.add('hidden');
            carregarPedidos();
        } else {
            const erro = await resposta.json();
            alert(erro.mensagem || 'Erro ao criar pedido');
        }
    }

    async function atualizarItem(id, item) {
        const resposta = await fetch(`/api/itens/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        return resposta;
    }

    async function criarItemPedido(idPedido, item) {
        const resposta = await fetch('/api/itens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idPedido, nome: item.nome, quantidade: item.quantidade, valorUnitario: item.valorUnitario })
        });
        return resposta;
    }

    async function excluirItem(itemId) {
        const resposta = await fetch(`/api/itens/${itemId}`, {
            method: 'DELETE'
        });
        return resposta;
    }

    async function salvarEdicaoPedido() {
        if (!editingPedidoId) {
            alert('Nenhum pedido selecionado para edição.');
            return;
        }

        const itensFormulario = obterItensDoFormulario();
        const itensExistentes = itensFormulario.filter(item => item.id !== undefined);
        const itensNovos = itensFormulario.filter(item => item.id === undefined);

        for (const item of itensExistentes) {
            const respostaItem = await atualizarItem(item.id, {
                idPedido: editingPedidoId,
                nome: item.nome,
                quantidade: item.quantidade,
                valorUnitario: item.valorUnitario
            });
            if (!respostaItem.ok) {
                const erro = await respostaItem.json();
                alert(erro.mensagem || `Erro ao atualizar o item ${item.nome}.`);
                return;
            }
        }

        for (const item of itensNovos) {
            const respostaNovoItem = await criarItemPedido(editingPedidoId, item);
            if (!respostaNovoItem.ok) {
                const erro = await respostaNovoItem.json();
                alert(erro.mensagem || 'Erro ao adicionar novo item.');
                return;
            }
        }

        for (const itemId of itensRemovidos) {
            const respostaRemocao = await excluirItem(itemId);
            if (!respostaRemocao.ok) {
                const erro = await respostaRemocao.json();
                alert(erro.mensagem || 'Erro ao remover item do pedido.');
                return;
            }
        }

        alert('Pedido atualizado com sucesso!');
        formPedido.reset();
        pedidoItensBody.innerHTML = '';
        criarLinhaItem();
        btnAdicionarItem.disabled = false;
        editMode = false;
        editingPedidoId = null;
        itensRemovidos = [];
        atualizarTituloFormulario();
        formPedido.classList.add('hidden');
        carregarPedidos();
    }

    function calcularTotalPedidos(pedidos) {
        return pedidos.reduce((total, pedido) => total + (pedido.itens || []).reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0), 0);
    }

    function aplicarFiltros() {
        let filtrados = [...pedidosCache];
        const termoBusca = inputSearch.value.trim().toLowerCase();
        const pedidoId = inputFiltroId.value ? Number(inputFiltroId.value) : null;
        const termoCliente = inputFiltroCliente.value.trim().toLowerCase();
        const minTotal = inputFiltroMin.value ? Number(inputFiltroMin.value) : null;
        const maxTotal = inputFiltroMax.value ? Number(inputFiltroMax.value) : null;
        const inicio = inputFiltroInicio.value ? new Date(inputFiltroInicio.value) : null;
        const fim = inputFiltroFim.value ? new Date(inputFiltroFim.value) : null;

        filtrados = filtrados.filter(pedido => {
            const total = (pedido.itens || []).reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
            const clienteNome = getClienteNome(pedido.idCliente).toLowerCase();
            const dataPedido = new Date(pedido.dtPedido);
            const termoItens = (pedido.itens || []).map(i => `${i.nome} ${i.quantidade} ${i.valorUnitario}`).join(' ').toLowerCase();

            if (pedidoId && pedido.id !== pedidoId) return false;
            if (termoCliente) {
                const matchClienteId = String(pedido.idCliente) === termoCliente;
                const matchClienteNome = clienteNome.includes(termoCliente);
                if (!matchClienteId && !matchClienteNome) return false;
            }
            if (minTotal !== null && total < minTotal) return false;
            if (maxTotal !== null && total > maxTotal) return false;
            if (inicio && dataPedido < inicio) return false;
            if (fim && dataPedido > fim) return false;
            if (termoBusca) {
                const termo = termoBusca;
                return String(pedido.id).includes(termo)
                    || clienteNome.includes(termo)
                    || termoItens.includes(termo);
            }
            return true;
        });

        renderPedidos(filtrados);
        resumoPedidosDiv.innerText = `Total de pedidos filtrados: ${filtrados.length} | Valor total: ${formatarDinheiro(calcularTotalPedidos(filtrados))}`;
    }

    function renderPedidos(pedidos) {
        listaPedidosDiv.innerHTML = '';
        if (pedidos.length === 0) {
            listaPedidosDiv.innerText = 'Nenhum pedido encontrado.';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Itens</th>
                    <th>Total</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        for (const pedido of pedidos) {
            const total = (pedido.itens || []).reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${getClienteNome(pedido.idCliente)} (${pedido.idCliente})</td>
                <td>${new Date(pedido.dtPedido).toLocaleDateString()}</td>
                <td>${(pedido.itens || []).length}</td>
                <td>${formatarDinheiro(total)}</td>
                <td>
                    <button type="button" class="button-view">Ver</button>
                    <button type="button" class="button-edit">Editar</button>
                    <button type="button" class="button-delete">Excluir</button>
                </td>
            `;
            tr.querySelector('.button-view').addEventListener('click', () => abrirModalPedido(pedido));
            tr.querySelector('.button-edit').addEventListener('click', () => iniciarEdicaoPedido(pedido));
            tr.querySelector('.button-delete').addEventListener('click', () => excluirPedido(pedido.id));
            tbody.appendChild(tr);
        }

        listaPedidosDiv.appendChild(table);
    }

    async function carregarPedidos() {
        const resposta = await fetch('/api/pedidos');
        pedidosCache = await resposta.json();
        aplicarFiltros();
    }

    function iniciarEdicaoPedido(pedido) {
        editMode = true;
        editingPedidoId = pedido.id;
        itensRemovidos = [];
        atualizarTituloFormulario();

        select.value = pedido.idCliente;
        select.disabled = true;
        pedidoItensBody.innerHTML = '';
        const itens = pedido.itens || [];
        if (itens.length === 0) {
            criarLinhaItem();
        } else {
            itens.forEach(item => criarLinhaItem(item));
        }

        formPedido.classList.remove('hidden');
        formPedido.scrollIntoView({ behavior: 'smooth' });
    }

    async function excluirPedido(pedidoId) {
        if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
        const resposta = await fetch(`/api/pedidos/${pedidoId}`, {
            method: 'DELETE'
        });
        if (resposta.ok) {
            carregarPedidos();
        } else {
            const erro = await resposta.json();
            alert(erro.mensagem || 'Erro ao excluir o pedido.');
        }
    }

    function abrirModalPedido(pedido) {
        modalTitulo.innerText = `Pedido #${pedido.id}`;
        modalInfos.innerText = `Cliente: ${getClienteNome(pedido.idCliente)} (${pedido.idCliente})\nData: ${new Date(pedido.dtPedido).toLocaleDateString()}`;
        modalItensBody.innerHTML = '';
        const total = (pedido.itens || []).reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);

        for (const item of pedido.itens || []) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${formatarDinheiro(item.valorUnitario)}</td>
                <td>${formatarDinheiro(item.quantidade * item.valorUnitario)}</td>
            `;
            modalItensBody.appendChild(tr);
        }

        modalTotal.innerText = `Valor total do pedido: ${formatarDinheiro(total)}`;
        pedidoModal.classList.remove('hidden');
    }

    function fecharModal() {
        pedidoModal.classList.add('hidden');
    }

    formPedido.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!validarFormulario()) return;
        if (editMode) {
            await salvarEdicaoPedido();
            return;
        }

        const pedido = {
            idCliente: Number(select.value),
            itens: obterItensDoFormulario()
        };
        await criarPedido(pedido);
    });

    btnNovoPedido.addEventListener('click', () => {
        editMode = false;
        editingPedidoId = null;
        itensRemovidos = [];
        atualizarTituloFormulario();
        formPedido.reset();
        pedidoItensBody.innerHTML = '';
        criarLinhaItem();
        select.disabled = false;
        btnAdicionarItem.disabled = false;
        formPedido.classList.remove('hidden');
        formPedido.scrollIntoView({ behavior: 'smooth' });
    });

    btnCancelarPedido.addEventListener('click', () => {
        editMode = false;
        editingPedidoId = null;
        itensRemovidos = [];
        atualizarTituloFormulario();
        formPedido.reset();
        pedidoItensBody.innerHTML = '';
        criarLinhaItem();
        btnAdicionarItem.disabled = false;
        formPedido.classList.add('hidden');
    });

    btnAdicionarItem.addEventListener('click', () => criarLinhaItem());

    [inputSearch, inputFiltroId, inputFiltroCliente, inputFiltroMin, inputFiltroMax, inputFiltroInicio, inputFiltroFim].forEach(input => {
        if (!input) return;
        input.addEventListener('input', aplicarFiltros);
    });

    btnLimparFiltro.addEventListener('click', () => {
        inputSearch.value = '';
        inputFiltroId.value = '';
        inputFiltroCliente.value = '';
        inputFiltroMin.value = '';
        inputFiltroMax.value = '';
        inputFiltroInicio.value = '';
        inputFiltroFim.value = '';
        aplicarFiltros();
    });

    pedidoModal.querySelector('.modal-close').addEventListener('click', fecharModal);
    pedidoModal.addEventListener('click', (event) => {
        if (event.target === pedidoModal) fecharModal();
    });

    formPedido.classList.add('hidden');
    carregarClientes().then(() => {
        criarLinhaItem();
        carregarPedidos();
        const parametros = new URLSearchParams(window.location.search);
        const idCliente = parametros.get('cliente');
        if (idCliente) {
            inputFiltroCliente.value = idCliente;
            aplicarFiltros();
            listaPedidosDiv.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
