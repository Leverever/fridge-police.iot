using System.ComponentModel.DataAnnotations;

namespace IOT.Models
{
    public class SensorReport
    {
        [Key]
        public int Id { get; set; }
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float HeatIndex { get; set; }
        public DateTime RecordedAt { get; set; }
    }
}
