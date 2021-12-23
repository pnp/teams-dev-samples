import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * Implementation of the StageView basic content page
 */
export const StageViewBasicTab = () => {
    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [inStageView, setInStageView] = useState<boolean>(false);

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
            if (context.frameContext! === microsoftTeams.FrameContexts.meetingStage) {
                setInStageView(true);
            }
            else {
                setInStageView(false);
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
                    <div>
                        {inStageView && <Header content="Stage view tab" />}
                        {!inStageView && <Header content="Side panel tab" />}
                    </div>
                </Flex.Item>
                <Flex.Item>
                    <div>
                        <div>
                            <Text content={entityId} />
                            {inStageView && <Text content="Now this tab is rendered in stage view." />}
                            {!inStageView && <Text content="Now this tab is rendered outside stage view. You can share it in stage view by clicking the share icon above." />}
                        </div>

                        <div>
                            <Button onClick={() => alert("It worked!")}>A sample button</Button>
                        </div>
                    </div>
                </Flex.Item>
                <Flex.Item styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Text size="smaller" content="(C) Copyright Markus Moeller" />
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
