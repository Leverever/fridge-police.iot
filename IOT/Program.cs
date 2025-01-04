using IOT.Models;
using IOT.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using RS1_2024_25.API.Services.Interfaces;
using RS1_2024_25.API.Services;

namespace IOT
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddDbContext<ApplicationDbContext>
                (options => options.UseSqlServer(builder.Configuration.GetConnectionString("db-iot")));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Custom services
            builder.Services.AddTransient<IMyFileHandler, FileHandler>();
            builder.Services.AddHostedService<MyBackgroundService>();
            builder.Services.AddSingleton<EspControl>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();

            app.UseCors(
                options => options
                    .SetIsOriginAllowed(x => _ = true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
            ); //This needs to set everything allowed

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.WebRootPath)),
                RequestPath = "/media"
            });

            app.MapControllers();

            app.Run();
        }
    }
}
