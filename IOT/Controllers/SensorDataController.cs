using IOT.Hubs;
using IOT.Models;
using IOT.Models.DTOs;
using IOT.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Services.Interfaces;

namespace IOT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController(ApplicationDbContext db, EspControl ec,
        IMyFileHandler fh, IConfiguration cfg, IHubContext<ReportHub> hub) : Controller
    {
        [Route("InsertTemperatureReportEndpoint")]
        [HttpPost]
        public async Task<IActionResult> InsertTemperatureReportEndpoint([FromBody] SensorReportRequest request, CancellationToken cancellationToken = default)
        {
            SensorReport sr = new SensorReport
            {
                Temperature = request.Temperature,
                Humidity = request.Humidity,
                HeatIndex = request.HeatIndex,
                RecordedAt = DateTime.Now,
            };
            db.SensorReports.Add(sr);
            await db.SaveChangesAsync(cancellationToken);

            ec.InCritical = sr.Temperature > ec.MaxTemperature;

            //SEND TO USER
            await hub.Clients.All.SendAsync("receivedSensorData", sr);
            await hub.Clients.All.SendAsync("receivedControlData", ec);

            return Ok();
        }

        [Route("GetSensorData")]
        [HttpGet]
        public async Task<ActionResult<List<SensorReport>>> GetSensorData([FromQuery] GetReportsRequest request, CancellationToken cancellationToken = default)
        {
            var sensorReports = db.SensorReports.OrderByDescending(sr => sr.RecordedAt).AsQueryable();
            if(request.ReturnAmount > 0)
            {
                sensorReports = sensorReports.Take(request.ReturnAmount);
            }

            return await sensorReports.ToListAsync(cancellationToken);
        }

    }
}
