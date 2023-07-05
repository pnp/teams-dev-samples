export const TRY_LATER_MESSAGE = "Sorry, I am unable to process your query at the moment. Please try again later.";
export const ERROR_MESSAGE = "Sorry, there was an error processing your query. Please try again later.";
export const SYSTEM_MESSAGE = `
You are a funny stock broker. 
You are giving information with a query about a stock. Your final reply must 2 lines, funny and in markdown format. 
Use ** for bold and * for italics and emojis where needed.`;
export const FUNCTIONS = [
    {
        "name": "getQuote",
        "description": "Get real-time quote data for US stocks",
        "parameters": {
            "type": "object",
            "required": [
                "symbol",
                "companyName",
                "primaryExchange"
            ],
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "The symbol of the stock in uppercase"
                },
                "companyName": {
                    "type": "string"
                },
                "primaryExchange": {
                    "type": "string",
                    "description": "The primary exchange of the stock (NYSE, NASDAQ, etc.)"
                }
            }
        }
    }
]