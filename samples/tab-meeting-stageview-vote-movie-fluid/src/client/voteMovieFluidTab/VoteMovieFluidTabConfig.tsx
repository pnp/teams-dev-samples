import * as React from "react";
import { Provider, Flex, Header, Input, Checkbox } from "@fluentui/react-northstar";
import { useState, useEffect, useRef } from "react";
import { useTeams } from "msteams-react-base-component";
import { app, authentication, pages } from "@microsoft/teams-js";
import Axios from "axios";
import { containerIdQueryParamKey, getFluidContainerId } from "../utils";

/**
 * Implementation of Vote Movie Fluid configuration page
 */
export const VoteMovieFluidTabConfig = () => {
  const [{ inTeams, theme, context }] = useTeams({});
  const [movie1, setMovie1] = useState<string>();
  const [movie2, setMovie2] = useState<string>();
  const [movie3, setMovie3] = useState<string>();
  const [reset, setReset] = useState<boolean>(false);
  const [containerId, setContainerId] = useState<string>();
  const movieRef1 = useRef<string>("");
  const movieRef2 = useRef<string>("");
  const movieRef3 = useRef<string>("");
  const resetRef = useRef<boolean>(false);
  const meetingID = useRef<string>("");
  const entityId = useRef("");
  const secureAccess = true; // false
  const loadConfig = async (meeting: string) => {
    Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${meeting}`).then((response) => {
        const config = response.data;
        setMovie1(config.movie1url);
        setMovie2(config.movie2url);
        setMovie3(config.movie3url);
        setContainerId(config.containerId);
    });
  };
  const onSaveHandler = async (saveEvent: pages.config.SaveEvent) => {
    if (secureAccess) {
      if (inTeams === true) {
        authentication.getAuthToken({
            resources: [process.env.TAB_APP_URI as string],
            silent: false
        } as authentication.AuthTokenRequestParameters).then(token => {
          saveConfig(token, saveEvent)
            
        }).catch(message => {
          app.notifyFailure({
              reason: app.FailedReason.AuthFailed,
              message
          });
        });
      }
    }
    else {
      saveConfig("", saveEvent);
    }
    
  };

  const saveConfig = async (idToken: string, saveEvent: pages.config.SaveEvent) => {
    if (reset) {
      setContainerId("");
    }
    const currentContainerId = await getFluidContainerId(context?.user?.userPrincipalName!, idToken, containerId);
    const host = "https://" + window.location.host;
    pages.config.setConfig({
      contentUrl: host + "/voteMovieFluidTab/?" + 
          containerIdQueryParamKey + "=" + currentContainerId +
          "&name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      websiteUrl: host + "/voteMovieFluidTab/?" + 
          containerIdQueryParamKey + "=" + currentContainerId +
          "&name={loginHint}&tenant={tid}&group={groupId}&theme={theme}",
      suggestedDisplayName: "Vote Movie Fluid",
      removeUrl: host + "/voteMovieFluidTab/remove.html?theme={theme}",
      entityId: entityId.current
    }).then(() => {
      Axios.post(`https://${process.env.PUBLIC_HOSTNAME}/api/config/${meetingID.current}`,
                { config: { movie1url: movieRef1.current, movie2url: movieRef2.current, movie3url: movieRef3.current, containerId: currentContainerId }});
      saveEvent.notifySuccess();
    });
  };

  useEffect(() => {
    movieRef1.current = movie1!;
    movieRef2.current = movie2!;
    movieRef3.current = movie3!;
  }, [movie1, movie2, movie3]);
  useEffect(() => {
      resetRef.current = reset!;        
  }, [reset]);
  useEffect(() => {
    if (context) {
      let meeting = "";
      if (context.meeting?.id === "") {
        meeting = "alias";
      }
      else {
        meeting = context.meeting?.id!;
      }
      meetingID.current = meeting;
      loadConfig(meeting);
      pages.config.registerOnSaveHandler(onSaveHandler);
      pages.config.setValidityState(true);
      app.notifySuccess();
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
            <Checkbox checked={reset}
                      toggle
                      label="Reset Votings" />
          </div>
        </Flex.Item>
      </Flex>
    </Provider>
  );
};
