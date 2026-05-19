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
            </tr>
        `;
    }
}

carregarClientes();


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

    const resposta = await fetch("/api/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });

    if (resposta.ok) {
        alert("Cliente cadastrado com sucesso!");
        formCliente.reset();
        carregarClientes();
    }
    else {
        // Se der erro, mostra um popup
        // TODO tirar popup e inserir erro no HTML
        const erro = await resposta.json();
        alert(erro.mensagem);
    }
});