// Chama o EF Core, para conectar com o DB
using Microsoft.EntityFrameworkCore;

// Inicia o criador da aplicação
var builder = WebApplication.CreateBuilder(args);

// Define quais configurações terá, com a OpennAPI e Swagger
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Define conexão com o DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Com as configurações, constrói o app
var app = builder.Build();

// Se estiver em desenvolvimento, mostra o Swagger(?)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Força o uso de HTTPS, mesmo fazendo requisição com HTTP
// app.UseHttpsRedirection();

// Endpoint criado como teste, pode ser excluído posteriormente
app.MapGet("/teste", () =>
{
    var json = new { teste = "valor de teste" };
    return json;
});


// ENDPOINT DE CONSULTA DE CLIENTES
// Cria o endpoint /clientes, que retorna um JSON com todos os clientes.
// Esse `AppDbContext context` diz que precisa receber esse contexto, que
// é do tipo AppDbContext, criado acima. Recebe o contexto automaticamente

// Possui `async` e `await` pois a consulta leva tempo.
app.MapGet("/clientes", async (AppDbContext context) =>
{
    // Aqui deve ter a conexão com o banco para consultar os clientes.
    // `context.Clientes` representa a tabela `clientes`
    // `ToListAsync()` executa o SQL no PostgreSQL
    var clientes = await context.Clientes.ToListAsync();
    return clientes; // Serializa para JSON automaticamente
});

// POST adiciona cliente
app.MapPost("/clientes", async (AppDbContext context, Cliente cliente) =>
{
    // Cláusulas de guarda antes de adicionar o cliente
    if (string.IsNullOrWhiteSpace(cliente.Nome))
    {
        return "O nome do cliente não pode ser vazio.";
    }
    context.Clientes.Add(cliente);
    await context.SaveChangesAsync();
    return "Cliente inserido com sucesso!";
});

app.MapDelete("/clientes/{id}", async (int id, AppDbContext context) =>
{
    var cliente = await context.Clientes.FindAsync(id);
    if (cliente == null)
    {
        return "404 not found";         // Retorna que não foi encontrado
    }
    context.Clientes.Remove(cliente);   // Remove o cliente encontrado
    await context.SaveChangesAsync();   // Sincroniza o banco
    return "200 cliente removido";

});

app.MapPut("/clientes/{id}", async (int id, AppDbContext context, Cliente cliente) =>
{
    var clienteEncontrado = await context.Clientes.FindAsync(id);
    if (clienteEncontrado == null)
    {
        return "404 not found";
    }

    // Cláusulas de guarda antes de adicionar o cliente
    if (string.IsNullOrWhiteSpace(cliente.Nome))
    {
        return "O nome do cliente não pode ser vazio.";
    }

    clienteEncontrado.Nome = cliente.Nome;
    clienteEncontrado.Cpf = cliente.Cpf;
    clienteEncontrado.Email = cliente.Email;
    clienteEncontrado.DtNascimento = cliente.DtNascimento;
    clienteEncontrado.Endereco = cliente.Endereco;
    await context.SaveChangesAsync();
    return "200 cliente modificado";
});


// ENDPOINTS DE PEDIDO

app.MapGet("/pedidos", async (AppDbContext context) =>
{
    var pedidos = await context.Pedidos.ToListAsync();
    return Results.Ok(pedidos);
});

app.MapPost("/pedidos", async (AppDbContext context, Pedido pedido) =>
{
    
});

app.MapDelete("/pedidos/{id}", async (int id, AppDbContext context) =>
{

});

app.MapPut("/pedidos/{id}", async (int id, AppDbContext context, Pedido pedido) =>
{
    
});

// Após todas as configurações, executa o App
app.Run();