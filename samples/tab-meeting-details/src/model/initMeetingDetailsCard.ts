export const InitMeetingDetailsCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "TextBlock",
      size: "Medium",
      weight: "Bolder",
      text: "Meeting Details"
    },
    {
      type: "TextBlock",
      text: "This action reloads current meeting details.",
      wrap: true
    }
  ],
  actions: [{
    type: "Action.Submit",
    id: "SndDetails",
    title: "Reload Meeting Details",
    data: {
      msteams: {
        "type": "task/submit"
      },
      verb: "getMeetingDetails",
      data: {
        meetingId: ""
      }
    }
  }],
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  version: "1.4"
};
  