using IOT.Services;
using Microsoft.AspNetCore.Mvc;

namespace IOT.Controllers
{
    [Route("/api/[controller]")]
    [ApiController]
    public class EspController(EspControl espControl) : Controller
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
    }
}
