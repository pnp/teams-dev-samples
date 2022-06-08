import * as React from "react";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { VoteMovieVoting } from "./VoteMovieVoting";
import { VoteMovieResults } from "./VoteMovieResult";

/**
 * Implementation of the Vote Movie content page
 */
export const VoteMovieTab = () => {
    const [{ inTeams, theme, context }] = useTeams();
    const [meetingId, setMeetingId] = useState<string | undefined>();
    const [inStageView, setInStageView] = useState<boolean>(false);

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.appInitialization.notifySuccess();
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            let meeting = "";
            if (context.meetingId === "") {
                meeting = "alias";
            }
            else {
                meeting = context.meetingId!;
            }
            setMeetingId(meeting);
            
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
        <div>
            {context && meetingId && inStageView && <VoteMovieResults meetingID={meetingId!} theme={theme} />}
            {context && meetingId && !inStageView && <VoteMovieVoting userID={context?.userObjectId!} meetingID={meetingId!} theme={theme} />}
        </div>
    );
};
