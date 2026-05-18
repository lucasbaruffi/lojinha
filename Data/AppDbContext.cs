// Basicamente importa a "biblioteca" do EF, 
// para saber o que é DbContext, DbContext, DbContextOptions ...
using Microsoft.EntityFrameworkCore;


// Criando a classe AppDbContext que tem o mesmo tipo que DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        // As configurações de acesso do banco estão em appsettings.Development.json
    }

    // Representa as tabelas
    // O que está entre <> é a classe criada nos Models
    public DbSet<Cliente> Clientes { get; set; } = null!; 
    public DbSet<Pedido> Pedidos { get; set; } = null!;
    public DbSet<ItemPedido> ItemsPedidos { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --------- TRABALHA EM CLIENTES ---------
        var cliente = modelBuilder.Entity<Cliente>();

        // Diz que representa a tabela "clientes"
        cliente.ToTable("clientes");

        // Identifica cada campo com as colunas da tabela
        cliente.Property(x => x.Id)
            .HasColumnName("id");

        cliente.Property(x => x.Cpf)
            .HasColumnName("cpf");

        cliente.Property(x => x.DtNascimento)
            .HasColumnName("dt_nascimento");

        cliente.Property(x => x.Email)
            .HasColumnName("email");

        cliente.Property(x => x.Endereco)
         .HasColumnName("endereco");

        cliente.Property(x => x.Nome)
            .HasColumnName("nome");


        // --------- TRABALHA EM PEDIDOS ---------
        var pedido = modelBuilder.Entity<Pedido>();
        
        // Diz o nome real da tabela
        pedido.ToTable("pedidos");

        // Identifica cada campo com as colunas da tabela
        pedido.Property(x => x.Id)
            .HasColumnName("id");

        pedido.Property(x => x.IdCliente)
            .HasColumnName("id_cliente");

        pedido.Property(x => x.DtPedido)
            .HasColumnName("dt_pedido");


        // --------- TRABALHA EM PEDIDOS ---------
        var ItemPedido = modelBuilder.Entity<ItemPedido>();
        
        // Diz o nome real da tabela
        ItemPedido.ToTable("item_pedido");

        // Identifica cada campo com as colunas da tabela
        ItemPedido.Property(x => x.Id)
            .HasColumnName("id");

        ItemPedido.Property(x => x.IdPedido)
            .HasColumnName("id_pedido");

        ItemPedido.Property(x => x.Nome)
            .HasColumnName("nome");
        
        ItemPedido.Property(x => x.ValorUnitario)
            .HasColumnName("valor_unitario");

        ItemPedido.Property(x => x.Quantidade)
            .HasColumnName("quantidade");
    }

}

