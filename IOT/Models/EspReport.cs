namespace IOT.Models
{
    public class EspReport
    {
        public int Id { get; set; }
        public DateTime LastUpdate { get; set; }
        public float Temperature { get; set; }
        public float Humidity { get; set; }
        public string Image {  get; set; }
    }
}
