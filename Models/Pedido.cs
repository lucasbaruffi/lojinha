public class Pedido
{
    public int Id { get; }
    public int IdCliente { get; set; }
    public DateTime DtPedido { get; set; } = DateTime.Now;
    public required List<ItemPedido> Itens { get; set; } = [];
}