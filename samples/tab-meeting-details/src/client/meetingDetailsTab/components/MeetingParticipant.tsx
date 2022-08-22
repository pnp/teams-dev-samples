import * as React from "react";
import { Button, Grid, Segment, Text } from "@fluentui/react-northstar";

export const MeetingParticipant = (props) => {
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
            <h2>Participant details</h2>
        </Segment>
        <Text content="User ID" />
        <Text content={props.meetingParticipant?.user.id} />

        <Text content="Name" />
        <Text content={props.meetingParticipant?.user.name} />

        <Text content="Surname" />
        <Text content={props.meetingParticipant?.user.surname} />

        <Text content="Email" />
        <Text content={props.meetingParticipant?.user.email} />
        
        <Text content="User Principal Name" />
        <Text content={props.meetingParticipant?.user.userPrincipalName} />

        <Text content="User Role" />
        <Text content={props.meetingParticipant?.user.userRole} />

        <Text content="User TenantID" />
        <Text content={props.meetingParticipant?.user.tenantId} />

        <Text content="User AadObjectId" />
        <Text content={props.meetingParticipant?.user.aadObjectId} />

        <Text content="Meeting Role" />
        <Text content={props.meetingParticipant?.meeting.role} />
    
        <Text content="User in Meeting" />
        <Text content={props.meetingParticipant?.meeting.inMeeting.toString()} />      

        <Text content="ConversationType" />
        <Text content={props.meetingParticipant?.conversation.conversationType} />

        <Text content="Conversation ID" />
        <Text content={props.meetingParticipant?.conversation.id} />

        <Text content="Conversation isGroup" />
        <Text content={props.meetingParticipant?.conversation.isGroup.toString()} />
      </Grid>
      <Button title="Snd Message" onClick={reloadDetails} primary>Reload Details</Button>
    </div>
  );
}