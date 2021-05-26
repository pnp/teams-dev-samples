import * as React from "react";
import { Provider, Flex, Header, Input, Button, Text } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams, getQueryVariable } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of the Action Preview Task Module page
 */
export const ActionPreviewMessageExtensionAction = () => {

    const [{ inTeams, theme }] = useTeams();
    const [email, setEmail] = useState<string>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        }
        const qryMail = getQueryVariable("email");
        if (qryMail) {
            setEmail(qryMail);
        }
    }, [inTeams]);

    return (
        <Provider theme={theme} styles={{ height: "100vh", width: "100vw", padding: "1em" }}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <div>
                        <Header content="Action Preview configuration" />
                        <Text content="Enter an e-mail address" />
                        <Input
                            placeholder="email@email.com"
                            fluid
                            clearable
                            value={email}
                            onChange={(e, data) => {
                                if (data) {
                                    setEmail(data.value);
                                }
                            }}
                            required />
                        <Button onClick={() => microsoftTeams.tasks.submitTask({
                            email
                        })} primary>OK</Button>
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
