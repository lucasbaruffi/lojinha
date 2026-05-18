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
            // Cláusula de guarda antes de adicionar o pedido
            var erroPedido = await PedidoValidator.ValidaPedido(pedido, context);
            if (erroPedido != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroPedido
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

            // Cláusula de guarda antes de adicionar o pedido
            var erroPedido = await PedidoValidator.ValidaPedido(pedido, context);
            if (erroPedido != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroPedido
                });
            }
            
            pedido.IdCliente = novoPedido.IdCliente;
            pedido.DtPedido = novoPedido.DtPedido;
            await context.SaveChangesAsync();
            return Results.Ok(pedido);
        });        
    }
}