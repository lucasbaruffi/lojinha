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
            // Cláusula de guarda antes de adicionar o item
            var erroItem = await ItemPedidoValidator.ValidaItem(item, context);
            if (erroItem != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroItem
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

            // Cláusula de guarda antes de modificar o item
            var erroItem = await ItemPedidoValidator.ValidaItem(novoItem, context, id);
            if (erroItem != "")
            {
                return Results.BadRequest(new
                {
                    mensagem = erroItem
                });
            }

            item.Nome = novoItem.Nome;
            item.Quantidade = novoItem.Quantidade;
            item.ValorUnitario = novoItem.ValorUnitario;
            await context.SaveChangesAsync();
            return Results.Ok(item);
        });        
    }
}