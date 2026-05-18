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


// ENDPOINTS DE CLIENTES

app.MapGet("/clientes", async (AppDbContext context) =>
{
    var clientes = await context.Clientes.ToListAsync();
    return Results.Ok(clientes);
});

app.MapGet("/clientes/{id}", async (int id, AppDbContext context) =>
{
   var cliente = await context.Clientes.FindAsync(id);
   return Results.Ok(cliente);
});

app.MapPost("/clientes", async (AppDbContext context, Cliente cliente) =>
{
    // Cláusulas de guarda antes de adicionar o cliente
    if (string.IsNullOrWhiteSpace(cliente.Nome))
    {
        return Results.BadRequest(new
        {
            message = "O nome do cliente não pode ser vazio."
        });
    }
    context.Clientes.Add(cliente);
    await context.SaveChangesAsync();
    return Results.Created($"/clientes/{cliente.Id}", cliente);
});

app.MapDelete("/clientes/{id}", async (int id, AppDbContext context) =>
{
    var cliente = await context.Clientes.FindAsync(id);
    if (cliente == null)
    {
        return Results.NotFound(new
        {
            message = "Cliente não encontrado."
        });
    }
    context.Clientes.Remove(cliente);
    await context.SaveChangesAsync();
    return Results.Ok(new
    {
        message = "Cliente removido com sucesso!"
    });
});

app.MapPut("/clientes/{id}", async (int id, AppDbContext context, Cliente cliente) =>
{
    var clienteEncontrado = await context.Clientes.FindAsync(id);
    if (clienteEncontrado == null)
    {
        return Results.NotFound(new
        {
            message = "Cliente não encontrado."
        });
    }

    // Cláusulas de guarda antes de adicionar o cliente
    if (string.IsNullOrWhiteSpace(cliente.Nome))
    {
        return Results.BadRequest(new
        {
            message = "O nome do cliente não pode ser vazio."
        });
    }

    clienteEncontrado.Nome = cliente.Nome;
    clienteEncontrado.Cpf = cliente.Cpf;
    clienteEncontrado.Email = cliente.Email;
    clienteEncontrado.DtNascimento = cliente.DtNascimento;
    clienteEncontrado.Endereco = cliente.Endereco;
    await context.SaveChangesAsync();
    return Results.Ok(clienteEncontrado);
});


// ENDPOINTS DE PEDIDO

app.MapGet("/pedidos", async (AppDbContext context) =>
{
    var pedidos = await context.Pedidos.ToListAsync();
    return Results.Ok(pedidos);
});

app.MapPost("/pedidos", async (AppDbContext context, Pedido pedido) =>
{
    // Verifica se o cliente existe
    var cliente = await context.Clientes.FindAsync(pedido.IdCliente);
    if (cliente == null)
    {
        return Results.NotFound(new
        {
            message = "Não foi encontrado nenhum cliente com o ID informado."
        });
    }

    context.Pedidos.Add(pedido);
    await context.SaveChangesAsync();
    return Results.Created();
});

app.MapDelete("/pedidos/{id}", async (int id, AppDbContext context) =>
{
    var pedido = await context.Pedidos.FindAsync(id);
    if (pedido == null)
    {
        return Results.NotFound(new
        {
            message = "Pedido não encontrado."
        });
    }

    context.Pedidos.Remove(pedido);
    await context.SaveChangesAsync();
    return Results.Ok(new
    {
        message = "Pedido removido com sucesso!"
    });
});

app.MapPut("/pedidos/{id}", async (int id, AppDbContext context, Pedido novoPedido) =>
{
    var pedido = await context.Pedidos.FindAsync(id);
    if (pedido == null)
    {
        return Results.NotFound(new
        {
            message = "Pedido não encontrado."
        });
    }

    // Verifica se o cliente existe
    var cliente = await context.Clientes.FindAsync(novoPedido.IdCliente);
    if (cliente == null)
    {
        return Results.NotFound(new
        {
            message = "Não foi encontrado nenhum cliente com o ID informado."
        });
    }
    
    pedido.IdCliente = novoPedido.IdCliente;
    pedido.DtPedido = novoPedido.DtPedido;
    await context.SaveChangesAsync();
    return Results.Ok(pedido);
});

// ENDPOINTS DE ITENS

app.MapGet("/itens", async (AppDbContext context) =>
{
    var itens = await context.ItensPedido.ToListAsync();
    return Results.Ok(itens);
});

app.MapPost("/itens", async (AppDbContext context, ItemPedido item) =>
{
    var pedido = await context.Pedidos.FindAsync(item.IdPedido);
    if (pedido == null)
    {
        return Results.NotFound(new
        {
            message = "Não foi encontrado nenhum pedido com o ID informado."
        });
    }

    context.ItensPedido.Add(item);
    await context.SaveChangesAsync();
    return Results.Created();
}); 

app.MapDelete("/itens/{id}", async (int id, AppDbContext context) =>
{
    var item = await context.ItensPedido.FindAsync(id);
    if (item == null)
    {
        return Results.NotFound(new
        {
            message = "Item não encontrado."
        });
    }

    context.ItensPedido.Remove(item);
    await context.SaveChangesAsync();
    return Results.Ok(new
    {
        message = "Item removido com sucesso!"
    });
});

app.MapPut("/itens/{id}", async (int id, AppDbContext context, ItemPedido novoItem) =>
{
    var item = await context.ItensPedido.FindAsync(id);
    if (item == null)
    {
        return Results.NotFound(new
        {
            message = "Item não encontrado."
        });
    }

    // Verifica se o Pedido existe
    var pedido = await context.Pedidos.FindAsync(novoItem.IdPedido);
    if (pedido == null)
    {
        return Results.NotFound(new
        {
            message = "Não foi encontrado nenhum pedido com o ID informado."
        });
    }

    item.IdPedido = novoItem.IdPedido;
    item.Nome = novoItem.Nome;
    item.Quantidade = novoItem.Quantidade;
    item.ValorUnitario = novoItem.ValorUnitario;
    await context.SaveChangesAsync();
    return Results.Ok(item);
});

// Após todas as configurações, executa o App
app.Run();