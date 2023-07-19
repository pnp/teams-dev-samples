import { useEffect, useRef, useState } from "react";
//import { useLiveCanvas } from "../utils/useLiveCanvas";
import FluidService from "../services/fluidLiveShare.js";
import { app } from "@microsoft/teams-js";
import "./DiscussPatientsPage.scss";
import { UserMeetingRole } from "@microsoft/live-share";
import * as liveShareHooks from "../live-share-hooks";
import { DefaultButton, Dialog, FontIcon, PrimaryButton, TextField } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import fluidLiveShare from "../services/fluidLiveShare.js";
import { LiveCanvasPage } from "./LiveCanvasPage.jsx";

export const DiscussPatientsPage = (presence) => {
  const [people, setPeople] = useState([]);
  const [isAddFeedbackVisible, setIsAddFeedbackVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedbackPatientName, setFeedbackPatientName] = useState("");
  const [clickedKey, setClickedKey] = useState("");
  const [isImageDialogVisible, setIsImageDialogVisible] = useState(false);
  const ALLOWED_ROLES = [UserMeetingRole.organizer, UserMeetingRole.presenter];
  const feedbackRef = useRef();

  const initialize = async () => {
    await app.initialize();
    app.notifySuccess();
    await FluidService.connect();
    const people = await FluidService.getPersonList();
    console.log(people);
    setPeople(people.people);
    setIsImageDialogVisible(people.currentImage.length > 0);

    FluidService.onNewData((people) => {
      setPeople(people.people);
      setIsImageDialogVisible(people.currentImage.length > 0);
    });
    initializeIcons();
  };

  useEffect(() => {
    initialize();
  }, []);

  const {
    localUser, // boolean that is true if local user is in one of the allowed roles
  } = liveShareHooks.usePresence(
    presence,
    ALLOWED_ROLES
  );

  const showPatient = (key) => {
    // console.log("showPatient");
    // console.log(localUser.roles);
    // users.forEach(user => {
    //   console.log(user.displayName);
    // });
    // if (localUserHasRoles) {
    //   console.log("Ispresenter true");
    //   //setLiveState(false);
    // }
    // if (isFeedbackVisible) {
    //   setClickedKey("");
    // }
    // else {
    //}
    if (key !== clickedKey) {
      //another user is clicked so alway show
      setIsFeedbackVisible(true);
    }
    else {
      //toggle the user visibility
      setIsFeedbackVisible(!isFeedbackVisible);
    }

    setClickedKey(key);
  }

  const showFeedback = (patientName, index) => {
    setIsAddFeedbackVisible(true);
    setClickedKey(index);
    setFeedbackPatientName(patientName);
  }

  const showImageDialog = (patientName, index) => {
    setIsImageDialogVisible(true);
    setClickedKey(index);
    setFeedbackPatientName(patientName);
  }

  const saveFeedback = () => {
    console.log(feedbackRef.current.value);
    fluidLiveShare.addFeedback(feedbackPatientName, feedbackRef.current.value, localUser.displayName);
    setIsAddFeedbackVisible(false);
    //setClickedKey("");
    setFeedbackPatientName("");
  }

  const renderPatientCard = (patient, index) => {
    return <div key={`patientcard${index}`} className={`patientcard ${index > 0 ? 'In-progress' : ''}`}>
      <div className="name" key={`card${index}`} onClick={() => showPatient(index)}>{patient.name}</div>
      <FontIcon className="icon" title="Add Feedback" iconName="Comment" onClick={() => showFeedback(patient.name, index)} />
      {index === 0 &&
        <FontIcon className="icon" title="Add Image" iconName="PictureCenter" onClick={() => showImageDialog(patient.name, index)} />
      }
    </div>;
  }

  const renderAddFeedback = (index) => {
    return (
      <div key={`addfeedback${index}`} className="addfeedbackcontainer">
        <TextField ref={feedbackRef} multiline={true} rows={6} />
        <PrimaryButton text="Save feedback" onClick={() => saveFeedback()} />
        <DefaultButton text="Cancel" onClick={() => setIsAddFeedbackVisible(false)} />
      </div>
    );
  }

  const renderUserFeedback = (patient, index) => {
    return (
      patient.feedback && patient.feedback.map((feedback) => {
        return (
          <div key={`feedbackcontainer${index}`} className="feedbackcontainer">
            <div className="header">{feedback.name} - {feedback.date}</div>
            <div className="text">{feedback.text}</div>
          </div>
        );
      })
    );
  }

  const modalPropsStyles = {
    main: [{
      selectors: {
        ['@media (min-width: 480px)']: {
          maxWidth: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }
      }
    }],
    innerContent: {
      height: '95%'
    }
  };

  const dialogHeaderStyles = {
    title: {
      paddingBottom: '0px'
    }
  }

  const renderImageDialog = (patient) => {
    return (
      <Dialog hidden={!isImageDialogVisible} dialogContentProps={{ title: patient.name, showCloseButton: false, styles: dialogHeaderStyles }} modalProps={{ className: "imagedialog", isBlocking: true, styles: modalPropsStyles }} onDismiss={() => setIsImageDialogVisible(false)}>
        <LiveCanvasPage name={patient.name} specialist={localUser?.displayName} onDismiss={() => setIsImageDialogVisible(false)} />
      </Dialog>
    );
  }

  return (
    <>
      <div className="patientcontainer">
        {people && people.length > 0 &&
          <>
            <h1>Welcome to Contoso Medicare</h1>
            <h3>Patient currently discussed</h3>
            <div className={`patientcardcontainer`}>
              {people.length > 1 &&
                <>
                  {renderPatientCard(people[0], 0)}
                  {renderUserFeedback(people[0], 0)}
                  {isAddFeedbackVisible && clickedKey === 0 &&
                    renderAddFeedback(0)
                  }
                  {isImageDialogVisible &&
                    renderImageDialog(people[0])
                  }
                </>
              }
            </div>
            <h3>Next patients</h3>
            <div className={`patientcardcontainer`}>
              {people.map((patient, index) => {
                return (
                  <>
                    {index > 0 &&
                      <>
                        {renderPatientCard(patient, index)}
                        {isAddFeedbackVisible && clickedKey === index &&
                          renderAddFeedback(index)
                        }
                        {isFeedbackVisible && clickedKey === index &&
                          renderUserFeedback(patient, index)
                        }
                      </>
                    }
                  </>
                );
              })}
            </div>
          </>
        }
      </div>
    </>
  );
};