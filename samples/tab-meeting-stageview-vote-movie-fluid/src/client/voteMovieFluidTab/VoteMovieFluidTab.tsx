import * as React from "react";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication, FrameContexts } from "@microsoft/teams-js";
import { VoteMovieFluidResult } from "./VoteMovieFluidResult";
import { VoteMovieFluidVoting } from "./VoteMovieFluidVoting";
import { SharedMap } from 'fluid-framework';
import Axios from "axios";
import { getFluidContainer } from "../utils";

/**
 * Implementation of the Vote Movie Fluid content page
 */
export const VoteMovieFluidTab = () => {
  const [{ inTeams, theme, context }] = useTeams();
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const [inStageView, setInStageView] = useState<boolean>(false);
  const [fluidContainerMap, setFluidContainerMap] = useState<SharedMap>();
  const [movie1, setMovie1] = useState<string>();
  const [movie2, setMovie2] = useState<string>();
  const [movie3, setMovie3] = useState<string>();
  const secureAccess = true; // false

  const setFluidAccess = (token: string, containerId: string) => {
    getFluidContainer(context?.user?.userPrincipalName!, token, containerId)
      .then((fluidContainer) => {
        if (fluidContainer !== undefined) {
          const sharedVotes = fluidContainer.initialObjects.sharedVotes as SharedMap;
          setFluidContainerMap(sharedVotes);
        }
      });
  };
  useEffect(() => {
    if (inTeams === true) {
      authentication.getAuthToken({
          resources: [process.env.TAB_APP_URI as string],
          silent: false
      } as authentication.AuthTokenRequestParameters).then(token => {
          if (context) {
            let meeting = "";
            if (context?.meeting?.id === "") {
              meeting = "alias";
            }
            else {
              meeting = context?.meeting?.id!;
            }
            setMeetingId(meeting);
            
            if (context?.page.frameContext === FrameContexts.meetingStage) {
              setInStageView(true);
            }
            else {
              setInStageView(false);
            }
            Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${meeting}`).then((response) => {
              const config = response.data;
              setMovie1(config.movie1url);
              setMovie2(config.movie2url);
              setMovie3(config.movie3url);
              if (secureAccess && token !== "") {
                setFluidAccess(token, config.containerId);
              }
              else if (!secureAccess) {
                setFluidAccess("", config.containerId);
              }    
            });
          }
          app.notifySuccess();
      }).catch(message => {
          app.notifyFailure({
              reason: app.FailedReason.AuthFailed,
              message
          });
      });
    }
  }, [inTeams]);
  
  /**
   * The render() method to create the UI of the tab
   */
  return (
    <div>
      {meetingId && inStageView && fluidContainerMap !== undefined &&
        <VoteMovieFluidResult 
                  meetingID={meetingId!} 
                  theme={theme}
                  movie1Url={movie1!} 
                  movie2Url={movie2!} 
                  movie3Url={movie3!} 
                  votingMap={fluidContainerMap!} />}
      {meetingId && !inStageView && fluidContainerMap !== undefined &&
        <VoteMovieFluidVoting 
                  userID={context?.user?.id!} 
                  meetingID={meetingId!} 
                  theme={theme} 
                  movie1Url={movie1!} 
                  movie2Url={movie2!} 
                  movie3Url={movie3!} 
                  votingMap={fluidContainerMap!} />}
    </div>
  );
};
