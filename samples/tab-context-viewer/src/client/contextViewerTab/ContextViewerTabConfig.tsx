import * as React from "react";
import { Provider, Flex, Text } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of Context Viewer Tab configuration page
 */
export const ContextViewerTabConfig = () => {

    const [{ inTeams, theme, context }] = useTeams({});
    const [text, setText] = useState<string>();
    const entityId = useRef("");

    const onSaveHandler = (saveEvent: microsoftTeams.settings.SaveEvent) => {
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
            contentUrl: host + "/contextViewerTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            websiteUrl: host + "/contextViewerTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            suggestedDisplayName: "Context Viewer",
            entityId: entityId.current
        });
        saveEvent.notifySuccess();
    };

    useEffect(() => {
        if (context) {
            setText(context.entityId);
            entityId.current = context.entityId;
            microsoftTeams.settings.registerOnSaveHandler(onSaveHandler);
            microsoftTeams.settings.setValidityState(true);
            microsoftTeams.appInitialization.notifySuccess();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context]);

    return (
        <Provider theme={theme}>
            <Flex fill={true}>
                <Flex.Item>
                    <div>
                        <Text content="Just click the Save button to proceed install the Context Viewer." />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
