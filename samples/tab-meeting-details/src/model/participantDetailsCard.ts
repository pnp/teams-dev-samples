import { IMeetingParticipant } from "./IMeetingParticipant";

const participantDetailsCard = {
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
              text: "Name",
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
              text: "Participant Name",
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
            title: "AADObjectID",
            value: "${value}"
        },
        {
            title: "Givenname",
            value: "${value}"
        },
        {
            title: "Surname",
            value: ""
        },
        {
            title: "Email",
            value: ""
        },
        {
            title: "UPN",
            value: "${value}"
        },
        {
            title: "Tenant ID",
            value: "${value}"
        },
        {
            title: "User Role",
            value: "${value}"
        },
        {
            title: "Meeting Role",
            value: "${value}"
        },
        {
            title: "In Meeting?",
            value: "${value}"
        },
        {
            title: "Conversation ID",
            value: "${value}"
        },
        {
            title: "Conversation Type",
            value: "${value}"
        },
        {
            title: "Conversation is Group?",
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
        participantDetails: {}
      }
    }
  ],
  "msteams": {
    "width": "Full"
  },
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.4"
};

export const getParticipantDetailsCard = (participantDetails: IMeetingParticipant) => {
  participantDetailsCard.body![0].columns![1].items[0].text = participantDetails.user.name;
  participantDetailsCard.body![1].facts![0].value = participantDetails.user.id;
  participantDetailsCard.body![1].facts![1].value = participantDetails.user.aadObjectId;
  participantDetailsCard.body![1].facts![2].value = participantDetails.user.givenName
  participantDetailsCard.body![1].facts![3].value = participantDetails.user.surname;
  participantDetailsCard.body![1].facts![4].value = participantDetails.user.email;
  participantDetailsCard.body![1].facts![5].value = participantDetails.user.userPrincipalName;
  participantDetailsCard.body![1].facts![6].value = participantDetails.user.tenantId;
  participantDetailsCard.body![1].facts![7].value = participantDetails.user.userRole;
  participantDetailsCard.body![1].facts![8].value = participantDetails.meeting.role;
  participantDetailsCard.body![1].facts![9].value = participantDetails.meeting.inMeeting.toString();
  participantDetailsCard.body![1].facts![10].value = participantDetails.conversation.id;
  participantDetailsCard.body![1].facts![11].value = participantDetails.conversation.conversationType;
  participantDetailsCard.body![1].facts![12].value = participantDetails.conversation.isGroup.toString();
  participantDetailsCard.actions[0].data.participantDetails = participantDetails;
  return participantDetailsCard;
};