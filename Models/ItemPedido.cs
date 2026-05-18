public class ItemPedido
{
    public int Id { get; set; }
    public int IdPedido { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorUnitario { get; set; }
    public int Quantidade { get; set; }   
}