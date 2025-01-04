using Microsoft.EntityFrameworkCore;

namespace IOT.Models
{
    public class ApplicationDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<EspReport> EspReports { get; set; }
        public DbSet<SensorReport> SensorReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.NoAction;
            }

            // opcija kod nasljeđivanja
            // modelBuilder.Entity<NekaBaznaKlasa>().UseTpcMappingStrategy();
        }
    }
}
