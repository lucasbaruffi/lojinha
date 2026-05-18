public class Pedido
{
    public int Id { get; }
    public int IdCliente { get; set; }
    public DateTime DtPedido { get; }
    public required List<ItemPedido> Itens { get; set; }
}