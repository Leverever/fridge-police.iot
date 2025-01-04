namespace IOT.Services
{
    public class EspControl
    {
        public bool RequirePicture { get; set; }
        public string PictureQuality { get; set; } = string.Empty;
        public bool WithFlash { get; set; }
        public bool AiSummary { get; set; }
        public bool AutoUpdate { get; set; }
        public bool RequireTemperature { get; set; }
        public int TimeInCritical { get; set; }
        public int MaxTimeInCritical { get; set; }


        public void CopyPropsFromObj(EspControl obj)
        {           
            var props = this.GetType().GetProperties();
            var newProps = obj.GetType().GetProperties();
            for (int i = 0; i < props.Length; i++)
            {
                props[i].SetValue(this, newProps[i].GetValue(obj));
            }  
        }
    }
}
