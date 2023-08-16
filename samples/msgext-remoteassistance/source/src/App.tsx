import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Field, Input, makeResetStyles, tokens } from "@fluentui/react-components";
import { NumberSymbol24Regular } from "@fluentui/react-icons";
import axios from "axios";
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from "@azure/communication-common";
import { AzureCommunicationCallAdapterArgs, CallComposite, fromFlatCommunicationIdentifier, useAzureCommunicationCallAdapter } from '@azure/communication-react';

const meetingIdStackClass = makeResetStyles({
  display: "flex",
  flexDirection: "column",
  rowGap: tokens.spacingVerticalL,
  width: "fit-content",
  margin: "auto"
});

const acsStackClass = makeResetStyles({
  display: "flex",
  flexDirection: "column",
  rowGap: tokens.spacingVerticalL,
  height: "90vh",
  width: "90vw",
  margin: "auto"
});

function App() {

  const displayName = "Anonymous"

  const [acsToken, setAcsToken] = useState<string>();
  const [acsUserId, setAcsUserId] = useState<string>();
  const [meetingId, setMeetingId] = useState<string>("");
  const [joinWebUrl, setJoinWebUrl] = useState<string>();
  const [validationState, setValidationState] = useState<'error' | 'warning' | 'success' | 'none'>("none");
  const [validationMessage, setValidationMessage] = useState<string>("");

  // Determine if we're running on a mobile device
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Create an AzureCommunicationTokenCredential
  const communicationTokenCredential = useMemo(() => {
    if (acsToken) {
      return new AzureCommunicationTokenCredential(acsToken);
    }
    return;
  }, [acsToken]);

  // Create call adapter args
  const communicationCallAdapterArgs = useMemo((): Partial<AzureCommunicationCallAdapterArgs> => {
    if (acsUserId && communicationTokenCredential && displayName && joinWebUrl) {
      return {
        userId: fromFlatCommunicationIdentifier(acsUserId) as CommunicationUserIdentifier,
        displayName,
        credential: communicationTokenCredential,
        locator: {
          meetingLink: joinWebUrl
        }
      }
    }
    return {};
  }, [acsUserId, communicationTokenCredential, displayName, joinWebUrl]);

  const callAdapter = useAzureCommunicationCallAdapter(communicationCallAdapterArgs);

  // If meetingId is in the URL, use it
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const meetingId = urlParams.get("meetingId");
    if (meetingId) {
      setMeetingId(meetingId);
    }
  }, []);

  // If meetingId is changed, update the URL
  useEffect(() => {
    if (meetingId) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("meetingId", meetingId);
      window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`);
    }
  }, [meetingId]);

  // If meetingId is changed, and it's a valid meetingId, get the joinWebUrl
  useEffect(() => {
    const init = async () => {
      setJoinWebUrl(undefined);
      setValidationState("none");
      setValidationMessage("");
      if (meetingId && meetingId.length > 10) {
        await axios(`/api/teamsMeeting/${meetingId}`)
          .then(response => {
            if (response && response.data && response.data.joinWebUrl) {
              setJoinWebUrl(response.data.joinWebUrl);
              setValidationState("success");
              setValidationMessage("Meeting found, please wait...");
            }
          })
          .catch(error => {
            // If the meeting doesn't exist (404), then we'll just stay on the page
            if (error.response && error.response.status !== 404) {
              console.error(error);
              setValidationMessage(`Error: ${error.message}`);
            } else {
              setValidationMessage("Meeting not found");
            }
            setValidationState("error");
          });
      } else {
        setValidationState("warning");
        setValidationMessage("Meeting ID too short");
      }
    };
    init();
  }, [meetingId]);

  // If we have a joinWebUrl, get an ACS token
  useEffect(() => {
    const init = async () => {
      setAcsToken(undefined);
      setAcsUserId(undefined);
      if (joinWebUrl) {
        await axios(`/api/token`)
          .then(response => {
            if (response && response.data && response.data.token && response.data.userId) {
              setAcsToken(response.data.token);
              setAcsUserId(response.data.userId);
            }
          })
          .catch(error => {
            console.error(error);
            setValidationMessage(`Error: ${error.message}`);
            setValidationState("error");
          });
      }
    };
    init();
  }, [joinWebUrl]);

  // Set meetingId to only contain digits
  const onMeetingIdChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    // Filter out non-numeric characters
    const meetingIdDigits = ev.target.value.replace(/\D/g, "");
    setMeetingId(meetingIdDigits);
  };

  if (callAdapter) {
    return (
      <div className={acsStackClass()}>
        <h1>Remote Assistance</h1>
        <CallComposite
          adapter={callAdapter}
          formFactor={isMobile ? 'mobile' : 'desktop'}
        />
      </div>
    );
  }

  return (
    <div className={meetingIdStackClass()}>
      <h1>Remote Assistance</h1>
      <Field
        label="Enter Meeting ID"
        validationState={validationState}
        validationMessage={validationMessage}
      >
        <Input
          contentBefore={<NumberSymbol24Regular />}
          type="text"
          size="large"
          value={meetingId}
          onChange={onMeetingIdChange}
        />
      </Field>
    </div>
  );
}

export default App;