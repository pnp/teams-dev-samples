
import { useContext, useEffect, useState } from "react";
import "./DocumentPack.css";
import { TeamsFxContext } from "../Context";
import config from "../../lib/config";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { TeamsUserCredentialContext } from "../../helpers/AuthHelper/TeamsUserCredentialContext";
import { loginAction } from "../../helpers/AuthHelper/Login";
import { Button } from "@fluentui/react-components";
import { Audio } from 'react-loader-spinner'
import FileSelector from "./FileSelector";
import { useData } from "@microsoft/teamsfx-react";
import Profile from "./Profile";
import { initializeIcons } from '@fluentui/font-icons-mdl2';

const scope = [
    'Files.ReadWrite.All',
    'user.read',
    'openid',
    'profile',
    'offline_access'
];

const loaderStyles = {
    justifyContent: 'center',
    alignItems: 'center'
};

export function DocumentPack(props: { environment?: string }) {

    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthenticated, SetIsAuthenticated] = useState<boolean>(false);
    const [userDisplayName, SetUserDisplayName] = useState('');

    useEffect(() => {
        initializeIcons();
        initAuth();
    }, []);

    const initAuth = async () => {
        setLoading(true);
        SetIsAuthenticated(false);
        if (await checkIsConsentNeeded()) {
            try {
                await loginAction(scope);
                SetIsAuthenticated(true);
                initData();
            } catch (error) {
                SetIsAuthenticated(false);
            }
        }
        else {
            initData();
            SetIsAuthenticated(true);
        }

    }

    const initData = async () => {
        const credential = TeamsUserCredentialContext.getInstance().getCredential();
        if (credential) {
            const userInfo = await credential.getUserInfo();
            SetUserDisplayName(userInfo.displayName);
        }
        setLoading(false);

    }

    return (
        <>

            <div className="app-container">
                {!loading && isAuthenticated === true && (
                    <>
                        {/* <Profile /> */}
                        <FileSelector />
                    </>
                )}
                {isAuthenticated === false && (
                    <div className="auth-container">
                        <Audio
                            height="80"
                            width="80"
                            color='#444791'
                            ariaLabel='three-dots-loading'
                            wrapperStyle={loaderStyles}
                        />
                    </div>
                )}

            </div>



        </>
    );


    async function checkIsConsentNeeded() {
        let needConsent = false;
        try {
            await TeamsUserCredentialContext.getInstance().getCredential().getToken(scope);
        } catch (error) {
            needConsent = true;
        }

        return needConsent;
    }

}
