export const TRY_LATER_MESSAGE =
  "Sorry, I am unable to process your query at the moment. Please try again later.";
export const SYSTEM_MESSAGE = `
You are a Weather expert agent. 
You are helping a user to find the weather detail about the provided location by the user. Users can provide post code or the location name to find the weather detail. 
Weather detail can be current weather information or the forecast weather detail.For example, 5 day forecast, 4 day forecast etc
Your final reply must be in markdown format. Use ** for bold and * for italics and emojis where needed. Your response should be small and human readable. Response should only be included weather description and temperature in celsius. Provide some relevent tips to enjoy the weather if needed. Add relevant weather emoji icons to the message`;

export const FUNCTIONS = [
  {
    name: "getCurrentWeatherDetail",
    description:
      "Gets the current weather detail based on provided location name (City name)",
    parameters: {
      type: "object",
      required: ["locationName"],
      properties: {
        locationName: {
          type: "string",
          description: "The name of the location",
        },
      },
    },
  },
  {
    name: "getWeatherForecastData",
    description: `
    The 7-day forecast is available by default at any location on the globe (City name). 
    The number of days of the forecast can be specified by the user. For instance, a 5 forecast for London, United Kingdom.  The default value is 7 if the user does not specify the number of days.
    `,
    parameters: {
      type: "object",
      required: ["locationName"],
      properties: {
        locationName: {
          type: "string",
          description: "The name of the location",
        },
        daysForecast: {
          type: "number",
          description: "The number of days of forecast requested by the user",
        },
      },
    },
  },
  {
    name: "showFunnyMessage",
    description:
      "If user's query is not related to weather detail then show a funny message",
    parameters: {
      type: "object",
      required: ["funnyMessage"],
      properties: {
        funnyMessage: {
          type: "string",
          description:
            "A funny message to say why user's query is not related to weather detail in markdown format. Max 20 words.",
        },
      },
    },
  },
];
