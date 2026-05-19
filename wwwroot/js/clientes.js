let clienteEditandoId = null;

async function carregarClientes() {
    `
    Função responsável por requisitar a lista de clientes do backend e 
    transformar em uma tabela.
    `

    const resposta = await fetch("/api/clientes");

    const clientes = await resposta.json();

    const tabela = document.getElementById("tabela-clientes");

    tabela.innerHTML = "";

    for (const cliente of clientes) {

        tabela.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.email}</td>
                <td>
                    <button onclick="editarCliente(${cliente.id})" class="button-edit">
                        Editar
                    </button>
                    <button onclick="excluirCliente(${cliente.id})" class="button-delete">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    }
}

carregarClientes() // Executado quando abre a página

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
        let url = `/api/clientes/${clienteEditandoId}`;
        let metodo = "PUT";
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