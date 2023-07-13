using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Cards;
public class StatusCard : Card<Status>
{
    public override string Template => """
        {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "${text}",
                    "wrap": true,
                    "size": "Medium",
                    "horizontalAlignment": "Center"
                }
            ]
        }
        """;
}

public class Status
{ 
    public string Text { get; set; }
}
