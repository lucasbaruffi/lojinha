// Inicia o criador da aplicação
var builder = WebApplication.CreateBuilder(args);

// Define quais configurações terá, com a OpennAPI e Swagger
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Após todas as configurações, executa o App
app.Run();

// Pelo que entendi, isso é um "tipo", que é utilizado na API do clima
// Utilizado para Orientação à Objetos.
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}