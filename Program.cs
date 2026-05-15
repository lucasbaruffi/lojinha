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

// Ainda não sei o que é isso
// app.UseHttpsRedirection();

// Função de exemplo ao criar o projeto, que retorna dados de clima falsos.
// E pode ser usada como base para os demais endpoints.
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool",
    "Mild", "Warm", "Balmy", "Hot",
    "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast(
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();

    return forecast;
})
.WithName("GetWeatherForecast");


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

// Após todas as configurações, executa o App
app.Run();

// Pelo que entendi, isso é um "tipo", que é utilizado na API do clima
// Utilizado para Orientação à Objetos.
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}