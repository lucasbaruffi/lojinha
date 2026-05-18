using Microsoft.EntityFrameworkCore;

public static class ItemPedidoValidator
{
    public static async Task<string> ValidaItem(
        ItemPedido item,
        AppDbContext context
        )
    {
        // ----------- ID PEDIDO ----------
        if (item.IdPedido == default)
        {
            return "Informe o ID do pedido";
        }

        var pedido = await context.Pedidos
            .FindAsync(item.IdPedido);
        if (pedido == null)
        {
            return $"Não existe pedido com o ID {item.IdPedido}";
        }

        // ------------- NOME -------------
        if (string.IsNullOrWhiteSpace(item.Nome))
        {
            return "O nome não pode estar vazio.";
        }

        if (item.Nome.Length > 255)
        {
            return "O nome não pode ter mais de 255 caracteres.";
        }

        // ------------ VALOR -------------
        if (item.ValorUnitario < 0)
        {
            return "O valor unitário não pode ser menor que 0.";
        }

        // --------- QUANTIDADE -----------
        if (item.Quantidade <= 0)
        {
            return "A quantidade deve ser maior que 0";
        }

        return "";
    }
}