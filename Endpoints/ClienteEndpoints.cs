using Microsoft.EntityFrameworkCore;

public static class ClienteEndpoints
{
    public static void MapClienteEndpoints(this WebApplication app)
    {
        app.MapGet("/api/clientes", async (AppDbContext context) =>
        {
            var clientes = await context.Clientes.ToListAsync();
            return Results.Ok(clientes);
        });

        app.MapGet("/api/clientes/{id}", async (int id, AppDbContext context) =>
        {
        var cliente = await context.Clientes.FindAsync(id);
        if (cliente == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Cliente não encontrado."
                });
            }
        return Results.Ok(cliente);
        });

        app.MapPost("/api/clientes", async (AppDbContext context, Cliente cliente) =>
        {
            // Cláusulas de guarda antes de adicionar o cliente
            var erroCliente = await ClienteValidator.ValidaCliente(cliente, context);
            if (erroCliente != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroCliente
                });
            }
            context.Clientes.Add(cliente);
            await context.SaveChangesAsync();
            return Results.Created($"/api/clientes/{cliente.Id}", cliente);
        });

        app.MapDelete("/api/clientes/{id}", async (int id, AppDbContext context) =>
        {
            var cliente = await context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Cliente não encontrado."
                });
            }
            context.Clientes.Remove(cliente);
            await context.SaveChangesAsync();
            return Results.Ok(new
            {
                mensagem = "Cliente removido com sucesso!"
            });
        });

        app.MapPut("/api/clientes/{id}", async (int id, AppDbContext context, Cliente novoCliente) =>
        {
            var cliente = await context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Cliente não encontrado."
                });
            }

            // Cláusulas de guarda antes de atualizar o cliente
            var erroCliente = await ClienteValidator.ValidaCliente(novoCliente, context, cliente.Id);
            if (erroCliente != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroCliente
                });
            }

            cliente.Nome = novoCliente.Nome;
            cliente.Cpf = novoCliente.Cpf;
            cliente.Email = novoCliente.Email;
            cliente.DtNascimento = novoCliente.DtNascimento;
            cliente.Endereco = novoCliente.Endereco;
            await context.SaveChangesAsync();
            return Results.Ok(cliente);
        });
    }
}