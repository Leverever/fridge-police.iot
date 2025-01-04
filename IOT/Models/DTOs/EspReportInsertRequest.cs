namespace IOT.Models.DTOs
{
    public class EspReportInsertRequest
    {
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float HeatIndex { get; set; }
        public IFormFile Image { get; set; }
        //public string ImageB64 { get; set; } = string.Empty;
    }
}
