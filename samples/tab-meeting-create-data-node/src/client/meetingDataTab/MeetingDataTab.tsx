import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication } from "@microsoft/teams-js";
import Axios from "axios";
import { ICustomer } from "../../model/ICustomer";

/**
 * Implementation of the Meeting Data content page
 */
export const MeetingDataTab = () => {

  const [{ inTeams, theme, context }] = useTeams();
  const [entityId, setEntityId] = useState<string | undefined>();
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [customer, setCustomer] = useState<ICustomer>();
  const [error, setError] = useState<string>();

  const loadCustomer = () => {
    Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/customer/${entityId}/${meetingId}`, {
                responseType: "json",
                headers: {
                  Authorization: `Bearer ${token}`
                }
    }).then(result => {
      if (result.data) {
        setCustomer(result.data);
      }     
    })
    .catch((error) => {
      console.log(error);
    })
  };

  useEffect(() => {
    if (inTeams === true) {
      authentication.getAuthToken({
        resources: [`api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}`],
        silent: false
      } as authentication.AuthTokenRequestParameters).then(bootstraptoken => {
        setToken(bootstraptoken);                       
        app.notifySuccess();
      }).catch(message => {
        setError(message);
        app.notifyFailure({
          reason: app.FailedReason.AuthFailed,
          message
        });
      });
    } else {
      setEntityId("Not in Microsoft Teams");
    }
  }, [inTeams]);

  useEffect(() => {
    if (context) {
      const meetingID: string = context?.meeting?.id ? context?.meeting?.id : '';
      setMeetingId(meetingID);
      setEntityId(context?.page.id); // EntityId = customerId
    }
  }, [context]);

  useEffect(() => {
    if (entityId && meetingId && token) {
      loadCustomer();
    }
  }, [entityId, meetingId, token]);
  /**
   * The render() method to create the UI of the tab
   */
  return (
    <Provider theme={theme}>
      <Flex fill={true} column styles={{
        padding: ".8rem 0 .8rem .5rem"
      }}>
        <Flex.Item>
          <Header content="Customer Info" />
        </Flex.Item>
        <Flex.Item>                                      
          <div className="gridTable">      
            <div className="gridRow">
              <div className="gridCell3">
                <label>Name</label>
              </div>      
              <div className="gridCell9">
                <label id="customerName" className="infoData">{customer && customer.Name ? customer.Name : ''}</label>
              </div>
            </div>
            <div className="gridRow">
              <div className="gridCell3">
                <label>Phone</label>
              </div>
              <div className="gridCell9">
                <label id="customerPhone" className="infoData">{customer && customer.Phone ? customer.Phone : ''}</label>
              </div>
            </div>
            <div className="gridRow">
              <div className="gridCell3">
                <label>Email</label>
              </div>
              <div className="gridCell9">
                <label id="customerEmail" className="infoData">{customer && customer.Email ? customer.Email : ''}</label>
              </div>
            </div>
            <div className="gridRow">
              <div className="gridCell3">
                <label>ID</label>
              </div>
              <div className="gridCell9">
                <label id="customerID" className="infoData">{customer && customer.Id ? customer.Id : ''}</label>
              </div>
            </div>
          </div>
        </Flex.Item>        
      </Flex>
    </Provider>
  );
};
