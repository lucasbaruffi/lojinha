using Microsoft.EntityFrameworkCore;

public static class ItemPedidoEndpoints
{
    public static void MapItemPedidoEndpoints(this WebApplication app)
    {
        app.MapGet("/itens", async (AppDbContext context) =>
        {
            var itens = await context.ItensPedido.ToListAsync();
            return Results.Ok(itens);
        });

        app.MapGet("/itens/{id}", async (int id, AppDbContext context) =>
        {
            var item = await context.ItensPedido.FindAsync(id);
            if (item == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Item não encontrado."
                });
            }
            return Results.Ok(item);
        });

        app.MapPost("/itens", async (AppDbContext context, ItemPedido item) =>
        {
            var pedido = await context.Pedidos.FindAsync(item.IdPedido);
            if (pedido == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Não foi encontrado nenhum pedido com o ID informado."
                });
            }

            context.ItensPedido.Add(item);
            await context.SaveChangesAsync();
            return Results.Created($"/itens/{item.Id}", item);
        }); 

        app.MapDelete("/itens/{id}", async (int id, AppDbContext context) =>
        {
            var item = await context.ItensPedido.FindAsync(id);
            if (item == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Item não encontrado."
                });
            }

            context.ItensPedido.Remove(item);
            await context.SaveChangesAsync();
            return Results.Ok(new
            {
                mensagem = "Item removido com sucesso!"
            });
        });

        app.MapPut("/itens/{id}", async (int id, AppDbContext context, ItemPedido novoItem) =>
        {
            var item = await context.ItensPedido.FindAsync(id);
            if (item == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Item não encontrado."
                });
            }

            // Verifica se o Pedido existe
            var pedido = await context.Pedidos.FindAsync(novoItem.IdPedido);
            if (pedido == null)
            {
                return Results.NotFound(new
                {
                    mensagem = "Não foi encontrado nenhum pedido com o ID informado."
                });
            }

            item.IdPedido = novoItem.IdPedido;
            item.Nome = novoItem.Nome;
            item.Quantidade = novoItem.Quantidade;
            item.ValorUnitario = novoItem.ValorUnitario;
            await context.SaveChangesAsync();
            return Results.Ok(item);
        });        
    }
}