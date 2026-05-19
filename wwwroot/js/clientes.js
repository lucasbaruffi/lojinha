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