import * as React from "react";
import { Button, Grid, Segment, Text } from "@fluentui/react-northstar";

export const MeetingDetails = (props) => {
  const reloadDetails = React.useCallback(() => {
    props.reloadDetails();
  },[props.reloadDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Grid className="l-text" columns="150px 80%">
        <Segment
            styles={{
            gridColumn: 'span 2',
            }}>
            <h2>Meeting details</h2>
        </Segment>
        <Text content="ID" />
        <Text content={props.meetingDetails?.details.id} />

        <Text content="Title" />
        <Text content={props.meetingDetails?.details.title} />
        
        <Text content="Type" />
        <Text content={props.meetingDetails?.details.type} />

        <Text content="JoinUrl" />
        <Text content={props.meetingDetails?.details.joinUrl} />

        <Text content="MsGraphResourceId" />
        <Text content={props.meetingDetails?.details.msGraphResourceId} />

        <Text content="ScheduledStartTime" />
        <Text content={props.meetingDetails?.details.scheduledStartTime} />
        
        <Text content="ScheduledSEndTime" />
        <Text content={props.meetingDetails?.details.scheduledEndTime} />

        <Text content="ScheduledSEndTime" />
        <Text content={props.meetingDetails?.organizer.id} />

        <Text content="AadObjectId" />
        <Text content={props.meetingDetails?.organizer.aadObjectId} />

        <Text content="ObjectId" />
        <Text content={props.meetingDetails?.organizer.objectId} />

        <Text content="ConversationType" />
        <Text content={props.meetingDetails?.conversation.conversationType} />

        <Text content="Conversation ID" />
        <Text content={props.meetingDetails?.conversation.id} />

        <Text content="Conversation isGroup" />
        <Text content={props.meetingDetails?.conversation.isGroup.toString()} />
      </Grid>
      <Button title="Snd Message" onClick={reloadDetails} primary>Reload Details</Button>
    </div>
  );
}