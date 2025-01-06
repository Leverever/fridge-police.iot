using Microsoft.AspNetCore.SignalR;

namespace IOT.Hubs
{
    public class ReportHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("connectionStart", "Connected to Fridge Police!");
            await base.OnConnectedAsync();
        }
    }
}
