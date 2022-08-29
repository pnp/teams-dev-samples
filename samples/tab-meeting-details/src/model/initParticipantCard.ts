export const InitParticipantCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "Participant Details"
    },
    {
      type: "TextBlock",
      text: "This action reloads current meeting participant details.",
      wrap: true
    }
  ],
  actions: [{
    type: "Action.Submit",
    id: "SndParticipantDetails",
    title: "Load Participant Details",
    data: {
      msteams: {
        "type": "task/submit"
      },
      verb: "getParticipantDetails",
      data: {
        meetingId: "",
        userId: "",
        tenantId: ""
      }
    }
  }],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4"
};
  