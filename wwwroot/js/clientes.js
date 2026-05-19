let clienteEditandoId = null;
let clientesCache = [];

const formContainerCliente = () => document.getElementById('form-cliente');
const btnNovoCliente = () => document.getElementById('btn-novo-cliente');
const btnCancelarCliente = () => document.getElementById('btn-cancelar-cliente');

async function carregarClientes() {
    `
    Função responsável por requisitar a lista de clientes do backend e 
    transformar em uma tabela.
    `

    const resposta = await fetch("/api/clientes");

    const clientes = await resposta.json();
    clientesCache = clientes;
    renderClientes(clientesCache);
}

function renderClientes(list) {
    const tabela = document.getElementById("tabela-clientes");
    tabela.innerHTML = "";
    for (const cliente of list) {
        tabela.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.email}</td>
                <td>
                    <button onclick="editarCliente(${cliente.id})" class="button-edit">Editar</button>
                    <button onclick="excluirCliente(${cliente.id})" class="button-delete">Excluir</button>
                    <button onclick="abrirPedidos(${cliente.id})">Pedidos</button>
                </td>
            </tr>
        `;
    }
}

function filtrarClientes(termo) {
    if (!termo) {
        renderClientes(clientesCache);
        return;
    }
    termo = termo.toLowerCase();
    const filtrados = clientesCache.filter(c => {
        return (String(c.id) || '').toLowerCase().includes(termo)
            || (c.nome || '').toLowerCase().includes(termo)
            || (c.cpf || '').toLowerCase().includes(termo)
            || (c.email || '').toLowerCase().includes(termo)
            || (c.endereco || '').toLowerCase().includes(termo)
            || (c.dtNascimento || '').toLowerCase().includes(termo);
    });
    renderClientes(filtrados);
}

carregarClientes() // Executado quando abre a página

// Esconder form por padrão e configurar botões
document.addEventListener('DOMContentLoaded', () => {
    const form = formContainerCliente();
    form.classList.add('hidden');

    btnNovoCliente().addEventListener('click', () => {
        form.classList.remove('hidden');
        form.scrollIntoView({behavior:'smooth'});
    });

    btnCancelarCliente().addEventListener('click', () => {
        form.reset();
        clienteEditandoId = null;
        form.classList.add('hidden');
    });

    const busca = document.getElementById('busca-clientes');
    const btnLimpar = document.getElementById('btn-limpar-busca');
    if (busca) {
        busca.addEventListener('input', (e) => filtrarClientes(e.target.value));
    }
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => { busca.value = ''; filtrarClientes(''); busca.focus(); });
    }
});

async function excluirCliente(id) {
    
    const confirmar = confirm(
        "Deseja realmente excluir este cliente?"
    );

    if (!confirmar) {
        return;
    }

    const resposta = await fetch(`/api/clientes/${id}`, {
        method: "DELETE"
    });

    if (resposta.ok) {
        mostrarMensagem("Cliente removido com sucesso!");
        carregarClientes();
    }
    else {
        const erro = await resposta.json();
        mostrarMensagem(erro.mensagem);
    }
}

async function editarCliente(id) {

    const resposta = await fetch(`/api/clientes/${id}`);
    const cliente = await resposta.json();

    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("email").value = cliente.email;
    document.getElementById("dtNascimento").value = cliente.dtNascimento;
    document.getElementById("endereco").value = cliente.endereco;

    clienteEditandoId = id;
    // mostrar o formulário quando editar
    const form = formContainerCliente();
    form.classList.remove('hidden');
}

const formCliente = document.getElementById("form-cliente");

// Fica escutando o envio do formulário, é ativado ao clicar.
formCliente.addEventListener("submit", async function (event) {

    event.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        email: document.getElementById("email").value,
        dtNascimento: document.getElementById("dtNascimento").value,
        endereco: document.getElementById("endereco").value
    };

    // Adiciona ou Altera, dependendo da variável clienteEditandoId
    let url = "/api/clientes";
    let metodo = "POST";

    if (clienteEditandoId !== null) {
        url = `/api/clientes/${clienteEditandoId}`;
        metodo = "PUT";
    }

    const resposta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

    if (resposta.ok) {
        mostrarMensagem("Cliente cadastrado com sucesso!");
        formCliente.reset();
        clienteEditandoId = null;
        carregarClientes();
        // esconder o form após salvar
        document.getElementById('form-cliente').classList.add('hidden');
    }
    else {
        // Se der erro, mostra um popup
        // TODO tirar popup e inserir erro no HTML
        const erro = await resposta.json();
        mostrarMensagem(erro.mensagem);
    }
});


function mostrarMensagem(texto) {
    const mensagem = document.getElementById("mensagem");
    mensagem.innerText = texto;
    setTimeout(() => {
        mensagem.innerText = "";
    }, 3000);
}

function abrirPedidos(idCliente) {

    window.location.href =
        `/pedidos.html?cliente=${idCliente}`;
}