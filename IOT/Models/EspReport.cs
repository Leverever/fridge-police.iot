using System.ComponentModel.DataAnnotations;

namespace IOT.Models
{
    public class EspReport
    {
        [Key]
        public int Id { get; set; }
        public DateTime LastUpdate { get; set; }
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public float HeatIndex { get; set; } = 0;
        public string Image {  get; set; }
    }
}
