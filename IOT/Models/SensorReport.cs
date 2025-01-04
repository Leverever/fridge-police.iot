namespace IOT.Models
{
    public class SensorReport
    {
        public int Id { get; set; }
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float HeatIndex { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
