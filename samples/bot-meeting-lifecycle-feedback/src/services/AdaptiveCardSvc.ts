import { Feedback } from "../models/Feedback";
import * as ACData from "adaptivecards-templating";

export default class AdaptiveCardSvc { 
    private static initialFeedback: Feedback = {
        meetingID: "",
        votedPersons: ["00000000-0000-0000-0000-000000000000"],
        votes1: 0,
        votes2: 0,
        votes3: 0,
        votes4: 0,
        votes5: 0
    };

    private static requestCard = {
        type: "AdaptiveCard",
        schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.4",
        refresh: {
            action: {
                type: "Action.Execute",
                title: "Refresh",
                verb: "alreadyVoted",
                data: {
                      feedback: "${feedback}"
                }
            },
            userIds: "${feedback.votedPersons}"
        },
        body: [
            {
                type: "TextBlock",
                text: "How did you like the meeting?",
                wrap: true
            },
            {
                type: "ActionSet",
                actions: [
                    {
                        type: "Action.Execute",
                        title: " ",
                        verb: "vote_1",
                        iconUrl: `https://${process.env.PUBLIC_HOSTNAME}/assets/1.png`,
                        data: {
                            feedback: "${feedback}"
                        }
                    },
                    {
                        type: "Action.Execute",
                        title: " ",
                        verb: "vote_2",
                        iconUrl: `https://${process.env.PUBLIC_HOSTNAME}/assets/2.png`,
                        data: {
                            feedback: "${feedback}"
                        }
                    },
                    {
                        type: "Action.Execute",
                        title: " ",
                        verb: "vote_3",
                        iconUrl: `https://${process.env.PUBLIC_HOSTNAME}/assets/3.png`,
                        data: {
                            feedback: "${feedback}"
                        }
                    },
                    {
                        type: "Action.Execute",
                        title: " ",
                        verb: "vote_4",
                        iconUrl: `https://${process.env.PUBLIC_HOSTNAME}/assets/4.png`,
                        data: {
                            feedback: "${feedback}"
                        }
                    },
                    {
                        type: "Action.Execute",
                        title: " ",
                        verb: "vote_5",
                        iconUrl: `https://${process.env.PUBLIC_HOSTNAME}/assets/5.png`,
                        data: {
                            feedback: "${feedback}"
                        }
                    }
                ]
            }
        ]
    };

    private static resultCard = {
        type: "AdaptiveCard",
        schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.4",
        refresh: {
            action: {
                type: "Action.Execute",
                title: "Refresh",
                verb: "alreadyVoted",
                data: {
                      feedback: "${feedback}"
                }
            },
            userIds: "${feedback.votedPersons}"
        },
        body: [
                { 
                    type: "ColumnSet",
                    columns: [
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "Image",
                                size: "Medium",
                                url: `https://${process.env.PUBLIC_HOSTNAME}/assets/1.png`
                            },
                            {
                                type: "TextBlock",
                                text: "${feedback.votes1}",
                                wrap: true,
                                horizontalAlignment: "Center"
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "Image",
                                size: "Medium",
                                url: `https://${process.env.PUBLIC_HOSTNAME}/assets/2.png`
                            },
                            {
                                type: "TextBlock",
                                text: "${feedback.votes2}",
                                wrap: true,
                                horizontalAlignment: "Center"
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "Image",
                                size: "Medium",
                                url: `https://${process.env.PUBLIC_HOSTNAME}/assets/3.png`
                            },
                            {
                                type: "TextBlock",
                                text: "${feedback.votes3}",
                                wrap: true,
                                horizontalAlignment: "Center"
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "Image",
                                size: "Medium",
                                url: `https://${process.env.PUBLIC_HOSTNAME}/assets/4.png`
                            },
                            {
                                type: "TextBlock",
                                text: "${feedback.votes4}",
                                wrap: true,
                                horizontalAlignment: "Center"
                            }
                        ]
                    },
                    {
                        type: "Column",
                        width: "stretch",
                        items: [
                            {
                                type: "Image",
                                size: "Medium",
                                url: `https://${process.env.PUBLIC_HOSTNAME}/assets/5.png`
                            },
                            {
                                type: "TextBlock",
                                text: "${feedback.votes5}",
                                wrap: true,
                                horizontalAlignment: "Center"
                            }
                        ]
                    }
                ]
            }
        ]
    };

    public static getInitialCard(meetingID: string) {
        let initialFeedback = this.initialFeedback;
        initialFeedback.meetingID = meetingID;
        var template = new ACData.Template(this.requestCard);
        var card = template.expand({ $root: { "feedback": initialFeedback }});
        return card;
    }

    public static getCurrentCard(feedback: Feedback) {
        var template = new ACData.Template(this.requestCard);
        var card = template.expand({ $root: { "feedback": feedback }});
        return card;
    }

    public static getDisabledCard(feedback: Feedback) {
        var template = new ACData.Template(this.resultCard);
        var card = template.expand({ $root: { "feedback": feedback }});
        return card;
    }
}