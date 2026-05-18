using Microsoft.EntityFrameworkCore;

public static class PedidoValidator

{
    public static async Task<string> ValidaPedido(
        Pedido pedido,
        AppDbContext context
    )
    {
        if (pedido.IdCliente == default)
        {
            return "Informe o ID do Cliente.";
        }

        var cliente = await context.Clientes
            .FindAsync(pedido.IdCliente);
        if (cliente == null)
        {
            return $"Não existe cliente com o ID {pedido.IdCliente}";
        }

        if (pedido.DtPedido > DateTime.Now)
        {
            return "A data do pedido não pode ser maior que a data e hora atual.";
        }

        if (pedido.Itens.Count == 0)
        {
            return "Informe ao menos um item.";
        }

        // Verifica cada item
        for (var i = 0; i < pedido.Itens.Count; ++i)
        {
            var item = pedido.Itens[i];
            var erroItem = await ItemPedidoValidator.ValidaItem(item, context, pedido.Id);
            if (erroItem != "")
            {
                return $"Erro com o item {item.Id} - {item.Nome}: \n{erroItem}";
            }
        }

        return "";
    }
}