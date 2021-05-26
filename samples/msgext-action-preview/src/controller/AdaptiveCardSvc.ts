export default class AdaptiveCardSvc {
    private static card = {
        type: "AdaptiveCard",
        body: [
            {
                type: "TextBlock",
                size: "Large",
                text: ""
            },
            {
                type: "TextBlock",
                size: "Medium",
                text: "Votes:"
            },
            {
                type: "TextBlock",
                size: "Medium",
                text: ""
            },
            {
                type: "Image",
                url: ""
            }
        ],
        actions: [
            {
                type: "Action.Submit",
                title: "Vote",
                data: {
                    cardVariables: {
                        email: "",
                        url: "",
                        votes: "0"
                    },
                    msteams: {
                        type: "task/fetch"
                    }  
                }
            }
          ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.2"
    };

    public static getInitialCard(eMail: string) {
        const url = `https://randomuser.me/api/portraits/thumb/women/${Math.round(Math.random() * 100)}.jpg`;        
        this.card.body[0].text = eMail;
        this.card.body[2].text = "0"
        this.card.body[3].url = url;
        this.card.actions[0].data.cardVariables.email = eMail;
        this.card.actions[0].data.cardVariables.url = url;
        this.card.actions[0].data.cardVariables.votes = "0";
        return this.card;
    }

    public static incrementVotes(eMail: string, url: string, increment: number) {        
        this.card.body[0].text = eMail;
        this.card.body[2].text = increment.toString();
        this.card.body[3].url = url;
        this.card.actions[0].data.cardVariables.email = eMail;
        this.card.actions[0].data.cardVariables.url = url;
        this.card.actions[0].data.cardVariables.votes = increment.toString();
        return this.card;
    }
}