using IOT.Hubs;
using IOT.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace IOT.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class EspController(EspControl espControl, IHubContext<ReportHub> hub) : Controller
    {
        [Route("SetControlData")]
        [HttpPost]
        public ActionResult<EspControl> SetData([FromBody]EspControl request) {
            if(request.TimeInCritical < 0)
            {
                return BadRequest();
            }
            espControl.CopyPropsFromObj(request);
            return Ok(espControl);
        }

        [Route("GetControlData")]
        [HttpGet]
        public ActionResult<EspControl> GetControl() {
            return Ok(espControl);
        }

        [Route("CheckTemp")]
        [HttpGet]
        public async Task CheckTemp()
        {
            if (espControl.InCritical)
            {
                if (espControl.TimeInCritical >= int.MaxValue)
                {
                    espControl.TimeInCritical = espControl.MaxTimeInCritical + 1;
                }

                espControl.TimeInCritical++;
                if(espControl.TimeInCritical > espControl.MaxTimeInCritical)
                {
                    await hub.Clients.All.SendAsync("receivedControlData", espControl);
                    Console.WriteLine($"IN CRITICAL TEMPERATURE FOR {espControl.TimeInCritical}s");
                }
            }
            else
            {
                int previousTime = espControl.TimeInCritical;
                espControl.TimeInCritical = 0;
                if(previousTime > 0)
                {
                    await hub.Clients.All.SendAsync("receivedControlData", espControl);
                    Console.WriteLine("No longer in critical temp!");
                }
            }
        }
    }
}
