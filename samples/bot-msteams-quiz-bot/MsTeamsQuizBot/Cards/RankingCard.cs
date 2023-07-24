using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Cards;
public class RankingCard : Card<Results>
{
    public override string Template => """
        {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "🏆 Results 🏆",
                    "wrap": true,
                    "horizontalAlignment": "Center",
                    "size": "Large",
                    "weight": "Bolder",
                    "isSubtle": true
                },
                {
                    "$data": "${Ranking}",
                    "type": "TextBlock",
                    "text": "${if(Score == $root.Ranking[0].Score, '🥇 ', if(Score == $root.Ranking[1].Score, '🥈 ', if(Score == $root.Ranking[2].Score, '🥉 ', '')))} ${Name} - ${Score}",
                    "wrap": true,
                    "horizontalAlignment": "Center",
                    "size": "${if(Score == $root.Ranking[0].Score, 'Large', 'Medium')}",
                    "spacing": "${if(Score >= $root.Ranking[3].Score, 'Small', 'None')}"
                }
            ]
        }
        """;
}

public class Results
{
    public IEnumerable<Entry> Ranking { get; set; }
}

public class Entry

{
    public string Name { get; set; }
    public int Score { get; set; }
}