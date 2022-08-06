export interface IMeetingParticipant {
  user: {
    id: string;
    aadObjectId: string;
    name: string;
    givenName: string;
    surname: string;
    email: string;
    userPrincipalName: string;
    tenantId: string;
    userRole: string;
  }
  meeting: {
    role: string;
    inMeeting: boolean;
  }
  conversation: {
    id: string;
    conversationType: string;
    isGroup: boolean;
  }
}