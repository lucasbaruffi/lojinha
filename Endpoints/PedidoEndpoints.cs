using Microsoft.EntityFrameworkCore;

public static class PedidoEndpoints
{
    public static void MapPedidoEndpoints(this WebApplication app)
    {
        app.MapGet("/pedidos", async (AppDbContext context) =>
        {
            var pedidos = await context.Pedidos.ToListAsync();
            return Results.Ok(pedidos);
        });

        app.MapGet("/pedidos/{id}", async (int id, AppDbContext context) =>
        {
            var pedido = await context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Pedido não encontrado."
                });
            }
            return Results.Ok(pedido);
        });

        app.MapPost("/pedidos", async (AppDbContext context, Pedido pedido) =>
        {
            // Verifica se o cliente existe
            var cliente = await context.Clientes.FindAsync(pedido.IdCliente);
            if (cliente == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Não foi encontrado nenhum cliente com o ID informado."
                });
            }

            context.Pedidos.Add(pedido);
            await context.SaveChangesAsync();
            return Results.Created($"pedidos/{pedido.Id}", pedido);
        });

        app.MapDelete("/pedidos/{id}", async (int id, AppDbContext context) =>
        {
            var pedido = await context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Pedido não encontrado."
                });
            }

            context.Pedidos.Remove(pedido);
            await context.SaveChangesAsync();
            return Results.Ok(new
            {
                mensagem = "Pedido removido com sucesso!"
            });
        });

        app.MapPut("/pedidos/{id}", async (int id, AppDbContext context, Pedido novoPedido) =>
        {
            var pedido = await context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Pedido não encontrado."
                });
            }

            // Verifica se o cliente existe
            var cliente = await context.Clientes.FindAsync(novoPedido.IdCliente);
            if (cliente == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Não foi encontrado nenhum cliente com o ID informado."
                });
            }
            
            pedido.IdCliente = novoPedido.IdCliente;
            pedido.DtPedido = novoPedido.DtPedido;
            await context.SaveChangesAsync();
            return Results.Ok(pedido);
        });        
    }
}