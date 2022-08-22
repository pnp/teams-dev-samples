import * as React from "react";
import { Provider, Flex, Text, Button, Header, Menu, tabListBehavior } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, TaskInfo, tasks } from "@microsoft/teams-js";
import Axios from "axios";
import { IMeetingDetails } from "../../model/IMeetingDetails";
import { IMeetingParticipant } from "../../model/IMeetingParticipant";
import { InitParticipantCard } from "../../model/initParticipantCard";
import { InitMeetingDetailsCard } from "../../model/initMeetingDetailsCard";
import { MeetingDetails } from "./components/MeetingDetails";
import { MeetingParticipant } from "./components/MeetingParticipant";

/**
 * Implementation of the Meeting Details content page
 */
export const MeetingDetailsTab = () => {
  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [meetingId, setMeetingId] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [tenantId, setTenantId] = useState<string>();
  const [meetingDetails, setMeetingDetails] = useState<IMeetingDetails>();
  const [meetingParticipant, setMeetingParticipant] = useState<IMeetingParticipant>();
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);

  const menuItems = [
    {
      key: 'meetingDetails',
      content: 'Meeting Details',
    },
    {
      key: 'meetingParticipant',
      content: 'Meeting Participant',
    }
  ];

  const getDetails = async (meetingID: string) => {        
    const response = await Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/getDetails/${meetingID}`);
    setMeetingDetails(response.data); 
  };

  const reloadMeetingDetails = React.useCallback(() => {
    InitMeetingDetailsCard!.actions![0].data!.data.meetingId = meetingId!;
    const initCardAttachment = {
                                contentType: "application/vnd.microsoft.card.adaptive",
                                content: InitMeetingDetailsCard };
    const taskModuleInfo: TaskInfo = {
        title: "Reload Details",
        card: JSON.stringify(initCardAttachment),
        width: 300,
        height: 250,
        completionBotId: process.env.MICROSOFT_APP_ID
    };

    tasks.startTask(taskModuleInfo, reloadMeetingDetailsCB);
  }, [meetingId]);

  const reloadMeetingDetailsCB = React.useCallback(() => {
    getDetails(meetingId!);     
    // tasks.submitTask();
  }, [meetingId]);

  const getParticipant = async (meetingID: string, userId, tenantId) => {        
    const response = await Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/getParticipantDetails/${meetingID}/${userId}/${tenantId}`);
    setMeetingParticipant(response.data);
  };

  const reloadParticipantDetails = React.useCallback(() => {
    InitParticipantCard!.actions![0].data!.data.meetingId = meetingId!;
    InitParticipantCard!.actions![0].data!.data.userId = userId!;
    InitParticipantCard!.actions![0].data!.data.tenantId = tenantId!;

    const initCardAttachment = {
                                contentType: "application/vnd.microsoft.card.adaptive",
                                content: InitParticipantCard };
    const taskModuleInfo: TaskInfo = {
        title: "Reload Details",
        card: JSON.stringify(initCardAttachment),
        width: 300,
        height: 250,
        completionBotId: process.env.MICROSOFT_APP_ID
    };

    tasks.startTask(taskModuleInfo, reloadParticipantDetailsCB);
  }, [meetingId, userId]);

  
  const reloadParticipantDetailsCB = React.useCallback(() => {
    getParticipant(meetingId!, userId, tenantId);     
  }, [meetingId, userId, tenantId]);

  const onActiveIndexChange = (event, data) => {
    setActiveMenuIndex(data.activeIndex);
  };

  useEffect(() => {
    if (inTeams === true) {
      app.notifySuccess();
    } else {
      setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      setEntityId(context.page.id);
      if (context.meeting) {
        getDetails(context.meeting.id);
        getParticipant(context.meeting.id, context.user?.id, context.user?.tenant?.id);
        setMeetingId(context.meeting.id);
        setUserId(context.user?.id);
        setTenantId(context.user?.tenant?.id);
      }
    }
  }, [context]);

  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex fill={true} column styles={{
          padding: ".8rem 0 .8rem .5rem"
      }}>
        <Flex.Item>
          <Header content="Meeting Information" />
        </Flex.Item>
        <Flex.Item>
          <div>
            <Menu
                defaultActiveIndex={0}
                activeIndex={activeMenuIndex}
                onActiveIndexChange={onActiveIndexChange}
                items={menuItems}
                underlined
                primary
                accessibility={tabListBehavior}
                aria-label="Meeting Information"
            />
            <div className="l-content">
                {activeMenuIndex === 0 && <MeetingDetails meetingDetails={meetingDetails} reloadDetails={reloadMeetingDetails} />}
                {activeMenuIndex === 1 && <MeetingParticipant meetingParticipant={meetingParticipant} reloadDetails={reloadParticipantDetails} />}
            </div>
          </div>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
