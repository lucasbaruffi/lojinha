// Chama o EF Core, para conectar com o DB
using Microsoft.EntityFrameworkCore;

// Inicia o criador da aplicação
var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:10000");

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
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

// Permite o Frontend da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// Força o uso de HTTPS, mesmo fazendo requisição com HTTP
// app.UseHttpsRedirection();


// ENDPOINTS DE CLIENTES

app.MapClienteEndpoints();

// ENDPOINTS DE PEDIDO

app.MapPedidoEndpoints();

// ENDPOINTS DE ITENS

app.MapItemPedidoEndpoints();

// Após todas as configurações, executa o App
app.Run();