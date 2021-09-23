import { Provider } from "@fluentui/react-northstar";
import Axios from "axios";
import * as React from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Providers, ProviderState } from "@microsoft/mgt";
import { HttpMethod, TeamsMsal2Provider } from "@microsoft/mgt-teams-msal2-provider";
import { Person, PersonViewType } from "@microsoft/mgt-react";
import { CustomAudio } from "./CustomAudio";

export const UserRecordedName = (props) => {
    const [audioUrl, setAudioUrl] = React.useState<string>("");

    TeamsMsal2Provider.microsoftTeamsLib = microsoftTeams;

    React.useEffect(() => {
        if (typeof props.dataUrl === "undefined" || props.dataUrl === null || props.dataUrl === "") {
            Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/audio/${props.driveItemId}`, {
                            responseType: "blob",
                            headers: {
                                Authorization: `Bearer ${props.accessToken}`
                            }
                        }).then(result => {
                            const r = new FileReader();
                            r.readAsDataURL(result.data);
                            r.onloadend = () => {
                                if (r.error) {
                                    alert(r.error);
                                } else {
                                    setAudioUrl(r.result as string);
                                }
                            };
                        });
        } else {
            setAudioUrl(props.dataUrl);
        }
        let provider = new TeamsMsal2Provider({
            clientId: `${process.env.TAB_APP_ID}`,
            authPopupUrl: '',
            scopes: ['User.Read'],
            ssoUrl: `https://${process.env.PUBLIC_HOSTNAME}/api/token`,
            httpMethod: HttpMethod.POST
        });
        Providers.globalProvider = provider;
        Providers.globalProvider.setState(ProviderState.SignedIn);
    }, []);

    return (
        <Provider theme={props.theme} >
            <div className="userRecording">
                <div className="userPic">
                    <Person userId={props.userID} view={PersonViewType.avatar} />
                </div>
                <div className="audioCell">
                    <span>{props.userName}</span>
                    {/* {audioUrl !== "" && <audio controls src={audioUrl}></audio>} */}
                    {audioUrl !== "" && <CustomAudio audioUrl={audioUrl} />}
                </div>
            </div>
        </Provider>
    );
};
