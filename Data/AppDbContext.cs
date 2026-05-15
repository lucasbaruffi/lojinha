// Basicamente importa a "biblioteca" do EF, 
// para saber o que é DbContext, DbContext, DbContextOptions ...
using Microsoft.EntityFrameworkCore;


// Criando a classe AppDbContext que tem o mesmo tipo que DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        // Pelo que entendi esse DbContext será basicamente a conexão com o 
        // banco de dados, aqui passaremos as configurações, como onde está
        // o banco e quais os dados de acesso.  
    }

    // Representa a tabela de Clientes:
    public DbSet<Cliente> Clientes { get; set; } = null!; 

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Cliente>()
            .ToTable("clientes");
    }

}

