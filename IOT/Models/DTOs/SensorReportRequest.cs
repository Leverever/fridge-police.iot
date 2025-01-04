namespace IOT.Models.DTOs
{
    public class SensorReportRequest
    {
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float HeatIndex { get; set; }
    }
}
