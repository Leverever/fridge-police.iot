using IOT.Models;
using IOT.Models.DTOs;
using IOT.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Services.Interfaces;
using System.Text;

namespace IOT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EspReportController(ApplicationDbContext db, EspControl ec, 
        IMyFileHandler fh, IConfiguration cfg) : Controller
    {
        [Route("InsertReportEndpoint")]
        [HttpPost]
        public async Task<IActionResult> InsertReportEndpoint([FromForm] EspReportInsertRequest request, CancellationToken cancellationToken = default)
        {
            ec.RequirePicture = ec.AutoUpdate;
            EspReport? espReport = null;
            if (ec.AutoUpdate) { 
                espReport = await db.EspReports.Where(e => e.LastUpdate.AddMinutes(1) > DateTime.Now)
                    .OrderByDescending(e => e.LastUpdate).FirstOrDefaultAsync(cancellationToken);
            }
            if (espReport == null) {
                espReport = new EspReport();
                db.EspReports.Add(espReport);
            }

            string fileName = string.Empty;

            if(request.Image != null)
            {
                fileName = await fh.UploadFileAsync(cfg["StaticFilePaths:ImageSet"], request.Image, 0, cancellationToken);
                if(fileName == null)
                {
                    return BadRequest("Problem with file");
                }
            }


            espReport.LastUpdate = DateTime.Now;
            espReport.Temperature = request.Temperature;
            espReport.Humidity = request.Humidity;
            espReport.Image = fileName;

            await db.SaveChangesAsync(cancellationToken);

            return Ok();
        }

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

            //SEND TO USER


            return Ok();
        }

        [Route("GetReports")]
        [HttpGet]
        public async Task<ActionResult<List<EspReport>>> GetReports([FromQuery] GetReportsRequest request, CancellationToken cancellationToken = default)
        {
            var reports = db.EspReports.OrderByDescending(er => er.LastUpdate);
            if (request.ReturnAmount > 0)
            {
                reports = reports.Take(request.ReturnAmount).OrderByDescending(er => er.LastUpdate);
            }

            return await reports.ToListAsync();
        }

        [Route("DeleteReport/{id}")]
        [HttpDelete]
        public async Task DeleteReport(int id, CancellationToken cancellationToken = default)
        {
            EspReport? espReport = await db.EspReports.FindAsync(id);

            if(espReport == null)
            {
                return;
            }

            db.EspReports.Remove(espReport);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
