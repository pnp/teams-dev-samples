using AdaptiveCards.Templating;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.TeamsFx.Conversation;
using Newtonsoft.Json;

namespace MsTeamsQuizBot.Cards;
public abstract class Card<T>
{
    public abstract string Template { get; }

    public IMessageActivity CreateActivity(T input)
    {
        var json = new AdaptiveCardTemplate(Template).Expand(input);

        return MessageFactory.Attachment
        (
            new Attachment
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = JsonConvert.DeserializeObject(json),
            }
        );
    }

    public InvokeResponse CreateResponse(T input)
    {
        var json = new AdaptiveCardTemplate(Template).Expand(input);
        return InvokeResponseFactory.AdaptiveCard(JsonConvert.DeserializeObject(json));
    }
}