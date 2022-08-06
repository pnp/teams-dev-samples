export interface IMeetingDetails {
  details: {
    id: string;
    msGraphResourceId: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    joinUrl: string;
    title: string;
    type: string;
  }
  conversation: {
    isGroup: boolean;
    conversationType: string;
    id: string;
  }
  organizer: {
    id: string;
    aadObjectId: string;
    objectId: string;
    tenantId: string;
  }
}
  