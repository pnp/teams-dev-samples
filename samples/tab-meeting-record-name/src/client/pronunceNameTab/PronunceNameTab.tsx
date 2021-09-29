import * as React from "react";
import { Provider, Flex, Text, Button, Header, CloseIcon } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import Axios from "axios";
import jwtDecode from "jwt-decode";
import { IRecording } from "../../model/IRecording";
import { UserRecordedName } from "./components/UserRecordedName";
import { RecordingArea } from "./components/RecordingArea";

/**
 * Implementation of the Pronunce name content page
 */
export const PronunceNameTab = () => {
    const [{ inTeams, theme, context }] = useTeams();
    const [meetingId, setMeetingId] = useState<string | undefined>();
    const [name, setName] = useState<string>("");
    const [accesstoken, setAccesstoken] = useState<string>();
    const [error, setError] = useState<string>();
    const [recording, setRecording] = useState<boolean>(false);
    const [recordings, setRecordings] = useState<IRecording[]>([]);

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    setAccesstoken(token);
                    getRecordings(token);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [`api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}`]
            });
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setMeetingId(context.meetingId);
        }
    }, [context]);

    const btnClicked = () => {
        setRecording(true);
    };

    const closeRecording = () => {
        setRecording(false);
    };
    
    const blobReceived = (blob: Blob, userID: string) => {
        setRecording(false);
        const formData = new FormData();
        formData.append("file", blob, `${userID}_${meetingId}.webm`);
        formData.append("meetingID", meetingId!);
        formData.append("userID", userID!);
        formData.append("userName", name!);
        Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/upload`, formData,
        { headers: { "Authorization": `Bearer ${accesstoken}`, "content-type": "multipart/form-data" }})
            .then(r => {
                getRecordings(accesstoken!);
            });
    };

    const getRecordings = async (token: string) => {
        const response = await Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/files/${context?.meetingId}`,
        { headers: { Authorization: `Bearer ${token}` }});

        setRecordings(response.data);
    };

    return (
        <Provider className={context && context.frameContext === microsoftTeams.FrameContexts.sidePanel ? "panelSize" : ""} theme={theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <Header content="User name recordings" />
                </Flex.Item>
                <Flex.Item>
                    <div>
                        {recordings.length > 0 && recordings.map((recording: any) => {
                            return <UserRecordedName key={recording.id} userName={recording.username} userID={recording.userID} driveItemId={recording.id} accessToken={accesstoken} dataUrl={recording.dataUrl} theme={theme} />;
                        })}

                        {(context && context.frameContext === microsoftTeams.FrameContexts.content) && <div>
                            {!recording ? (
                                <Button onClick={btnClicked}>Record name</Button>
                            ) :
                            (<div className="closeDiv"><CloseIcon className="closeIcon" onClick={closeRecording} />
                                <RecordingArea userID={context?.userObjectId} clientType={context?.hostClientType} callback={blobReceived} />
                            </div>)}
                        </div>}
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
