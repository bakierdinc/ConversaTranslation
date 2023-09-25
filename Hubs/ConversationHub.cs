using Microsoft.AspNetCore.SignalR;

namespace ConversaTranslationJS.Hubs
{
    public class ConversationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string nick, string text, string sourceCulture)
        {
            await Clients.All.SendAsync("ReceiveMessage", nick, text, sourceCulture);
        }
    }
}
