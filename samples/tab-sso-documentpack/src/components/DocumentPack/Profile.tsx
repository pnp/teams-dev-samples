import { useContext, useEffect, useState } from "react";
import { GraphService } from "../../services/graphservice";
import { Audio } from 'react-loader-spinner'
import { TeamsFxContext } from "../Context";
import { Person, PersonCard, PersonCardInteraction, ViewType } from "@microsoft/mgt-react";
import { Avatar, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { useData } from "@microsoft/teamsfx-react";
import { BearerTokenAuthProvider, TeamsUserCredential, createApiClient } from "@microsoft/teamsfx";
import config from "../../lib/config";
import { Button } from "@fluentui/react-components";
import { TeamsUserCredentialContext } from "../../helpers/AuthHelper/TeamsUserCredentialContext";

export interface IProfileProps {

}
const loaderStyles = {
    justifyContent: 'center',
    alignItems: 'center'
};

const functionName = config.apiName || "myFunc";

const Profile: React.FunctionComponent<IProfileProps> = (props) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<any>({});


    useEffect(() => {
        getUserProfileAsync();
    }, []);


    const getUserProfileAsync = async () => {
        try {
            setLoading(true);
            const teamsUserCredential = TeamsUserCredentialContext.getInstance().getCredential();
            if (!teamsUserCredential) {
                throw new Error("TeamsFx SDK is not initialized.");
            }

            const apiBaseUrl = config.apiEndpoint + "/api/";
            // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
            const apiClient = createApiClient(
                apiBaseUrl,
                new BearerTokenAuthProvider(async () => (await teamsUserCredential.getToken(""))!.token)
            );

            const response = await apiClient.get(functionName);
            setProfileData(response.data);
            setLoading(false)
        } catch (err: unknown) {
            console.log(err);
            setIsError(true);
            setLoading(false);
        }
    }

    return (
        <>
            {
                loading ? <Audio
                    height="80"
                    width="80"
                    color='#444791'
                    ariaLabel='three-dots-loading'
                    wrapperStyle={loaderStyles}
                /> :
                    isError ? "Error getting data from an Azure function" :
                        profileData && <div className="person-container">
                            <div className="ms-Grid" dir="ltr">
                                <div className="ms-Grid-row">
                                    <div className="ms-Grid-col ms-sm6">
                                        <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
                                            <Meta
                                                avatar={<Avatar src={profileData?.photoUrl} />}
                                                title={profileData.displayName}
                                                description={profileData.jobTitle}
                                            />
                                        </Card>

                                    </div>
                                </div>
                            </div>
                        </div>

            }



        </>
    );
};
export default Profile;