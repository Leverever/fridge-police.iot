using IOT.Services;
using Microsoft.AspNetCore.Mvc;

namespace IOT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly EspControl espControl;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, EspControl espControl)
        {
            _logger = logger;
            this.espControl = espControl;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public ActionResult<EspControl> Get()
        {
            return Ok(espControl);
            //return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            //{
            //    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            //    TemperatureC = Random.Shared.Next(-20, 55),
            //    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            //})
            //.ToArray();
        }
    }
}
