export const TRY_LATER_MESSAGE = "Sorry, I am unable to process your query at the moment. Please try again later.";
export const SYSTEM_MESSAGE = `
You are a TfL customer service agent. 
You are helping a customer with a query about the status of a line.
Your final reply must be in markdown format. Use ** for bold and * for italics and emojis where needed.`;
export const FUNCTIONS = [
    {
        "name": "getLineStatus",
        "description": "Get the status of a London Underground line",
        "parameters": {
            "type": "object",
            "required": [
                "lineId"
            ],
            "properties": {
                "lineId": {
                    "type": "string",
                    "description": "The id of the London Underground line",
                    "enum": ["bakerloo", "central", "circle", "district", "dlr", "elizabeth", "hammersmith-city", "jubilee", "london-overground", "metropolitan", "northern", "piccadilly", "tram", "victoria", "waterloo-city"]
                }
            }
        }
    },
    {
        "name": "displayLineStatus",
        "description": "Display the status of a London Underground line",
        "parameters": {
            "type": "object",
            "required": [
                "lineId",
                "lineName",
                "lineHexColour",
                "status",
                "statusColour",
                "funnyResponseToUserQuery"
            ],
            "properties": {
                "lineId": {
                    "type": "string",
                    "description": "The id of the London Underground line"
                },
                "lineName": {
                    "type": "string",
                    "description": "The name of the London Underground line"
                },
                "lineHexColour": {
                    "type": "string",
                    "description": "The colour of the London Underground line. Look for this in the TfL website. Should be of the format #000000."
                },
                "status": {
                    "type": "string",
                    "description": "The short status of the London Underground line"
                },
                "statusColour": {
                    "type": "string",
                    "description": "The colour value based on that status",
                    "enum": ["default","good","warning","attention"]
                },
                "funnyResponseToUserQuery": {
                    "type": "string",
                    "description": "A funny response in natural language to be sent to user's initial query in markdown format."
                }
            }
        }
    },
    {
        "name": "showFunnyMessage",
        "description": "If user's query is not related to TfL status then show a funny message",
        "parameters": {
            "type": "object",
            "required": [
                "funnyMessage"
            ],
            "properties": {
                "funnyMessage": {
                    "type": "string",
                    "description": "A funny message to say why user's query is not related to TfL in markdown format. Max 20 words."
                }
            }
        }
    }
]