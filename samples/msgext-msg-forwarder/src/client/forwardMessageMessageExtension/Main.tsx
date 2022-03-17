import * as React from "react";
import { Provider, Flex, Header, Input, Button, Text, Checkbox, Alert } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import {Providers} from '@microsoft/mgt-element';

import { PeoplePicker, PersonType, TeamsChannelPicker, UserType } from '@microsoft/mgt-react';

/**
 * Implementation of the Forward Message Task Module page
 */
export const Main = () => {

    const [{ inTeams, theme }] = useTeams();
    const [email, setEmail] = useState<string>();
    const [name, setName] = useState<string>();
    const [converId, setconverId] = useState<string>();
    const [messageId, setmessageId] = useState<string>();
    const [error, setError] = useState<string>();
    const [showError, setshowError] = useState<boolean>(false);
    const [showSuccess, setshowSuccess] = useState<boolean>(false);
    const [currentUserId, setcurrentUserId] = useState<string>();
    const [people, setPeople] = useState<any[]>([]);
  //  const [people, setPeople] = useState([]);
    const [channel, setChannel] = useState<any>({});
    const [quoteSender, setquoteSender] = useState<boolean>();
   

    

    useEffect(() => {


        if (inTeams === true) {
            setMessageId();
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    setcurrentUserId(decoded!.oid);
                   
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.TAB_APP_URI as string]
            });
        } else {
            console.log("Not in Microsoft Teams");
        }
    }, [inTeams]);

    const handleSelectionChanged = (event) => {
        console.log(event);
        setPeople(event.detail);
      };

      const handleChannelSelectionChanged = (e) => {
        console.log("selectedChanne",e);
        setChannel(e.detail[0].channel);
      };

    const setMessageId = () => {
                // get all search params (including ?)
                const queryString = window.location.search;
                // it will look like this: ?product=shirt&color=blue&newuser&size=m

                // parse the query string's paramters
                const urlParams = new URLSearchParams(queryString);

                // To get a parameter simply write something like the follwing
                const conver_id = urlParams.get('conver_id');
                if(conver_id) {
                    setconverId(conver_id);
                }
                const msg_id = urlParams.get('msgid');
                if(msg_id) {
                    setmessageId(msg_id);
                }
    }
    

    const  sendMessage = async () => {
        //const chatid= messageId?.split(';')[0];
        //const msgId = messageId?.split('messageid=')[1]    
        try{
        const chatMessageToForward = await Providers.globalProvider.graph.client.api('https://graph.microsoft.com/v1.0/chats/' + converId  + '/messages/'+  messageId).get();
        let body = {
            "body": chatMessageToForward.body
        }

        if(quoteSender) {
            const blockquotestr = "<blockquote>\n<p>From: " + chatMessageToForward.from.user.displayName + "</p>\n</blockquote>\n"
            const messageContent = blockquotestr + chatMessageToForward.body.content;
            body = {
            "body": {
                "contentType" : "html",
                "content" : messageContent}
            } 

        }
        if(channel.id) {
            const message = await Providers.globalProvider.graph.client.api('https://graph.microsoft.com/v1.0/chats/' + channel.id + '/messages').post(body);
        }
        people.map(async (element)=> {
            const creatChatBody = {
                "chatType": "oneOnOne",
                "members": [
                  {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": "https://graph.microsoft.com/v1.0/users('" + currentUserId + "')"
                  },
                  {
                    "@odata.type": "#microsoft.graph.aadUserConversationMember",
                    "roles": ["owner"],
                    "user@odata.bind": "https://graph.microsoft.com/v1.0/users('" + element.id +"')"
                  }
                ]
              }

              try {
               const chatObj = await Providers.globalProvider.graph.client.api('https://graph.microsoft.com/v1.0/chats').post(creatChatBody);
               console.log("chatObj",chatObj)
               const message = await Providers.globalProvider.graph.client.api('https://graph.microsoft.com/v1.0/chats/' + chatObj.id + '/messages').post(body);
          
               setshowSuccess(true);
               //window.open('','_self').close()
               microsoftTeams.tasks.submitTask({})
            }catch(ex)
            {
              
                 setshowError(true)
                setshowSuccess(false);
                console.log("error sending message",ex)
            }

          });

        }
        catch(e)
        {
            
            setshowError(true)
            setshowSuccess(false);
            console.log("error retriving message",e)  
        }
       

       
         
         
    }
    return (
        <Provider theme={theme} styles={{ height: "100vh", width: "100vw", padding: "1em" }}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <div>
                        <Header content="Forward Message configuration" />
                        <Text content="Select User/s" />
                        <PeoplePicker type={PersonType.person} userType={UserType.user} selectionChanged={handleSelectionChanged} />
                        <br/>
                        <Text content="Select Channel(only one channel allowed)" />
                        <TeamsChannelPicker   selectionChanged={handleChannelSelectionChanged} />
                        <br/>
                        <div> 
                        <Alert visible={showSuccess} success content="Message forwarded sucessfully" />
                        <Alert visible={showError}  content="Error in sending Message" />
                        <Checkbox onChange={(e,data)=> {console.log(data); data?setquoteSender(data.checked):false}} label="Quote Sender" toggle />
                        </div>
                        <div>
                            <Button onClick={() => sendMessage() }>Send</Button>
                        </div>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
