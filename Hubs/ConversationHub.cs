using Azure;
using Azure.AI.Translation.Text;
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

        public async Task SendMessage(string nick, string text, string culture)
        {
            await Clients.All.SendAsync("ReceiveMessage", nick, text, culture);
        }

        public async Task<string> GetTranslatedText(string targetCulture, string text, string sourceCuture)
        {
            const string key = "decd668b65024de8853c652fa02978cb";
            const string region = "westeurope";
            var credential = new AzureKeyCredential(key);
            var client = new TextTranslationClient(credential, region);

            var translation = await client.TranslateAsync(targetCulture, text, sourceCuture);
            return translation?.Value?.FirstOrDefault()?.Translations?.FirstOrDefault()?.Text;
        }
    }
}
