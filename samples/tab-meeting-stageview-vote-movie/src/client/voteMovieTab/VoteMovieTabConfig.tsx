import * as React from "react";
import { Provider, Flex, Header, Input, Button } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import Axios from "axios";

/**
 * Implementation of Vote Movie configuration page
 */
export const VoteMovieTabConfig = () => {
    const [{ inTeams, theme, context }] = useTeams({});
    const [movie1, setMovie1] = useState<string>();
    const [movie2, setMovie2] = useState<string>();
    const [movie3, setMovie3] = useState<string>();
    const movieRef1 = useRef<string>("");
    const movieRef2 = useRef<string>("");
    const movieRef3 = useRef<string>("");
    const meetingID = useRef<string>("");
    const entityId = useRef("");

    const loadConfig = async (meeting: string) => {
        Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${meeting}`).then((response) => {
                const config = response.data;
                setMovie1(config.movie1url);
                setMovie2(config.movie2url);
                setMovie3(config.movie3url);
            });
    };
    
    const onSaveHandler = (saveEvent: microsoftTeams.settings.SaveEvent) => {
        const host = "https://" + window.location.host;
        microsoftTeams.settings.setSettings({
            contentUrl: host + "/voteMovieTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            websiteUrl: host + "/voteMovieTab/?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
            suggestedDisplayName: "Vote Movie",
            removeUrl: host + "/voteMovieTab/remove.html?theme={theme}",
            entityId: entityId.current
        });
        saveConfig();
        saveEvent.notifySuccess();
    };

    const saveConfig = () => {
        Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${meetingID.current}`,
                    { config: { movie1url: movieRef1.current, movie2url: movieRef2.current, movie3url: movieRef3.current }});
    };

    useEffect(() => {
        movieRef1.current = movie1!;
        movieRef2.current = movie2!;
        movieRef3.current = movie3!;
    }, [movie1, movie2, movie3]);
    useEffect(() => {
        if (context) {            
            let meeting = "";
            if (context.meetingId === "") {
                meeting = "alias";
            }
            else {
                meeting = context.meetingId!;
            }
            meetingID.current = meeting;
            loadConfig(meeting);
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
                        <Header content="Configure your tab" />
                        <Input
                            label="Movie 1"
                            placeholder="Enter a url for movie 1"
                            fluid
                            clearable
                            value={movie1}
                            onChange={(e, data) => {
                                if (data) {
                                    setMovie1(data.value);
                                }
                            }}
                            required />
                        <Input
                            label="Movie 2"
                            placeholder="Enter a url for movie 2"
                            fluid
                            clearable
                            value={movie2}
                            onChange={(e, data) => {
                                if (data) {
                                    setMovie2(data.value);
                                }
                            }}
                            required />
                        <Input
                            label="Movie 3"
                            placeholder="Enter a url for movie 3"
                            fluid
                            clearable
                            value={movie3}
                            onChange={(e, data) => {
                                if (data) {
                                    setMovie3(data.value);
                                }
                            }}
                            required />
                    </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
