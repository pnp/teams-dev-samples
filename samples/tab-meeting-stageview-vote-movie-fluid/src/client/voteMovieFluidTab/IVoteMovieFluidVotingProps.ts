import { ThemePrepared } from "@fluentui/react-northstar";
import { SharedMap } from "fluid-framework";

export interface IVoteMovieFluidVotingProps {
    meetingID: string;
    userID: string;
    theme: ThemePrepared;
    movie1Url: string;
    movie2Url: string;
    movie3Url: string;
    votingMap: SharedMap;
}