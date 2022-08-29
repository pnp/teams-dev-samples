import { IMeetingDetails } from "./IMeetingDetails";

const detailsCard = {
  type: "AdaptiveCard",
  body: [
    {
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: "auto",
          items: [
            {
              type: "TextBlock",
              text: "Title",
              wrap: true
            }
          ]
        },
        {
          type: "Column",
          items: [
            {
              type: "TextBlock",
              weight: "Bolder",
              text: "Meeting Title",
              horizontalAlignment: "Center"
            }
          ],
          width: "stretch"
        }
      ]
    },
    {
      type: "FactSet",
      facts: [
        {
            title: "ID",
            value: "${value}"
        },
        {
            title: "MSGraph Resource ID",
            value: "${value}"
        },
        {
            title: "Join Url",
            value: "${value}"
        },
        {
            title: "Start",
            value: "{{DATE(2017-02-14T06:08:39Z,SHORT)}}"
        },
        {
            title: "End",
            value: "{{DATE(2017-02-14T06:08:39Z,SHORT)}}"
        },
        {
            title: "Type",
            value: "${value}"
        },
        {
            title: "isGroup",
            value: "${value}"
        },
        {
            title: "conversationType",
            value: "${value}"
        },
        {
            title: "conversationID",
            value: "${value}"
        },
        {
            title: "OrganizerID",
            value: "${value}"
        },
        {
            title: "OrganizerAADObjectID",
            value: "${value}"
        },
        {
            title: "OrganizerTenantID",
            value: "${value}"
        }
      ]
    }
  ],
  actions: [
    {
      type: 'Action.Submit',
      title: 'Close',
      data: {
        verb: "close",
        msteams: {
          type: "task/submit"
        },
        meetingDetails: {}
      }
    }
  ],
  "msteams": {
    "width": "Full"
  },
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.4"
};

export const getMeetingDetailsCard = (meetingDetails: IMeetingDetails) => {
  detailsCard.body![0].columns![1].items[0].text = meetingDetails.details.title;
  detailsCard.body![1].facts![0].value = meetingDetails.details.id;
  detailsCard.body![1].facts![1].value = meetingDetails.details.msGraphResourceId;
  detailsCard.body![1].facts![2].value = meetingDetails.details.joinUrl
  detailsCard.body![1].facts![3].value = meetingDetails.details.scheduledStartTime;
  detailsCard.body![1].facts![4].value = meetingDetails.details.scheduledEndTime;
  detailsCard.body![1].facts![5].value = meetingDetails.details.type;
  detailsCard.body![1].facts![6].value = meetingDetails.conversation.isGroup.toString();
  detailsCard.body![1].facts![7].value = meetingDetails.conversation.conversationType;
  detailsCard.body![1].facts![8].value = meetingDetails.conversation.id;
  detailsCard.body![1].facts![9].value = meetingDetails.organizer.id;
  detailsCard.body![1].facts![10].value = meetingDetails.organizer.aadObjectId;
  detailsCard.body![1].facts![11].value = meetingDetails.organizer.tenantId;
  detailsCard.actions[0].data.meetingDetails = meetingDetails;
  return detailsCard;
};