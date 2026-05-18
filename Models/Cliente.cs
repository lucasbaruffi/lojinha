// Classe que representa um cliente
// get e set para dizer que pode ler e escrever
public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly DtNascimento { get; set; }
    public string Endereco { get; set; } = string.Empty;
}
