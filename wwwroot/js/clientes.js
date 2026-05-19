let clienteEditandoId = null;
let clientesCache = [];

const formContainerCliente = () => document.getElementById('form-cliente');
const btnNovoCliente = () => document.getElementById('btn-novo-cliente');
const btnCancelarCliente = () => document.getElementById('btn-cancelar-cliente');

const confirmModal = () => document.getElementById('confirm-modal');
const confirmTitulo = () => document.getElementById('confirm-titulo');
const confirmMensagem = () => document.getElementById('confirm-mensagem');
const btnConfirmCancelar = () => document.getElementById('btn-confirm-cancelar');
const btnConfirmConfirmar = () => document.getElementById('btn-confirm-confirmar');

function showConfirmationModal(titulo, mensagem) {
    return new Promise((resolve) => {
        confirmTitulo().innerText = titulo;
        confirmMensagem().innerText = mensagem;
        confirmModal().classList.remove('hidden');
        
        const confirmHandler = () => {
            confirmModal().classList.add('hidden');
            btnConfirmConfirmar().onclick = null;
            btnConfirmCancelar().onclick = null;
            confirmModal().onclick = null;
            resolve(true);
        };
        
        const cancelHandler = () => {
            confirmModal().classList.add('hidden');
            btnConfirmConfirmar().onclick = null;
            btnConfirmCancelar().onclick = null;
            confirmModal().onclick = null;
            resolve(false);
        };
        
        btnConfirmConfirmar().onclick = confirmHandler;
        btnConfirmCancelar().onclick = cancelHandler;
        confirmModal().onclick = (e) => {
            if (e.target === confirmModal()) cancelHandler();
        };
    });
}

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
    const confirmar = await showConfirmationModal('Excluir Cliente', 'Deseja realmente excluir este cliente?');

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

    // valida campos antes de enviar
    if (!validarFormularioCliente()) {
        return;
    }

    const cliente = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim().replaceAll(".", "").replaceAll("-", ""),
        email: document.getElementById("email").value.trim(),
        dtNascimento: document.getElementById("dtNascimento").value,
        endereco: document.getElementById("endereco").value.trim()
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

// helpers de validação e UI
function setFieldError(fieldId, message) {
    const el = document.getElementById(`error-${fieldId}`);
    if (el) el.innerText = message || '';
}

function clearFieldErrors() {
    setFieldError('nome', '');
    setFieldError('cpf', '');
    setFieldError('email', '');
    setFieldError('dtNascimento', '');
    setFieldError('endereco', '');
}

function isValidEmail(email) {
    if (!email) return false;
    // simples regex para validação básica
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
}

function onlyDigits(text) {
    return (text || '').replace(/\D/g, '');
}

function isValidCPF(cpf) {
    if (!cpf) return false;
    cpf = onlyDigits(cpf);
    if (cpf.length !== 11) return false;
    // rejeita sequências iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    const calc = (t) => {
        let s = 0;
        for (let i = 0; i < t; i++) s += Number(cpf.charAt(i)) * ((t + 1) - i);
        let r = 11 - (s % 11);
        return r > 9 ? 0 : r;
    };

    return calc(9) === Number(cpf.charAt(9)) && calc(10) === Number(cpf.charAt(10));
}

function formatCPF(value) {
    const d = onlyDigits(value).slice(0, 11);
    let res = d;
    if (d.length > 9) res = d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (d.length > 6) res = d.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    else if (d.length > 3) res = d.replace(/(\d{3})(\d+)/, "$1.$2");
    return res;
}

function validarFormularioCliente() {
    clearFieldErrors();
    let valido = true;

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const email = document.getElementById('email').value.trim();
    const dt = document.getElementById('dtNascimento').value;
    const endereco = document.getElementById('endereco').value.trim();

    if (!nome) { setFieldError('nome', 'Nome é obrigatório'); valido = false; }

    if (!cpf) { setFieldError('cpf', 'CPF é obrigatório'); valido = false; }
    else if (!isValidCPF(cpf)) { setFieldError('cpf', 'CPF inválido'); valido = false; }

    if (!email) { setFieldError('email', 'Email é obrigatório'); valido = false; }
    else if (!isValidEmail(email)) { setFieldError('email', 'Email inválido'); valido = false; }

    if (!dt) { setFieldError('dtNascimento', 'Data de nascimento é obrigatória'); valido = false; }
    else {
        const hoje = new Date();
        const data = new Date(dt + 'T00:00:00');
        if (isNaN(data.getTime())) { 
            setFieldError('dtNascimento', 'Data inválida'); 
            valido = false; 
        } else if (data >= new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) { 
            setFieldError('dtNascimento', 'Data deve ser anterior ao dia atual'); 
            valido = false; 
        } else if (data > new Date(hoje.getFullYear()-18, hoje.getMonth(), hoje.getDate())) {
            setFieldError('dtNascimento', 'Deve ter mais de 18 anos');
            valido = false;
        }
    }

    if (!endereco) { setFieldError('endereco', 'Endereço é obrigatório'); valido = false; }

    return valido;
}

// máscara e limpeza de erros enquanto digita
document.addEventListener('input', (e) => {
    if (!e.target) return;
    const id = e.target.id;
    if (id === 'cpf') {
        const pos = e.target.selectionStart;
        e.target.value = formatCPF(e.target.value);
        setFieldError('cpf', '');
        try { e.target.setSelectionRange(pos, pos); } catch (err) {}
    }
    if (id === 'email') {
        setFieldError('email', '');
    }
    if (id === 'nome') setFieldError('nome', '');
    if (id === 'dtNascimento') setFieldError('dtNascimento', '');
    if (id === 'endereco') setFieldError('endereco', '');
});

function abrirPedidos(idCliente) {

    window.location.href =
        `/pedidos.html?cliente=${idCliente}`;
}