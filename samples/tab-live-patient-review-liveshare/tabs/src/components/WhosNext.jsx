import React from "react";
import { useEffect, useState, useCallback } from "react";
import { app, FrameContexts } from "@microsoft/teams-js";
import { UserMeetingRole } from "@microsoft/live-share";
import "./WhosNext.scss";
import FluidService from "../services/fluidLiveShare.js";
import { meeting } from "@microsoft/teams-js";
import { inTeams } from "../utils/inTeams.js";
import * as liveShareHooks from "../live-share-hooks";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import {
  FontIcon,
  PrimaryButton
} from "@fluentui/react";
//import { Reorder } from "framer-motion";
import { Draggable } from "react-drag-reorder";
import fluidLiveShare from "../services/fluidLiveShare.js";

//class WhosNextTab extends React.Component {
export const WhosNextTab = (presence) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     ready: false,
  //     message: "Connecting to Fluid service...",
  //     userName: "",
  //     addedName: "",
  //     people: [],
  //   };
  //   this.inputChange = this.inputChange.bind(this);
  //   this.keyDown = this.keyDown.bind(this);
  // }

  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Connecting to Fluid service...");
  const [userName, setUserName] = useState("");
  const [addedName, setAddedName] = useState("");
  const [people, setPeople] = useState([]);
  const ALLOWED_ROLES = [UserMeetingRole.organizer];

  const initialize = async () => {
    app.initialize().then(async () => {
      try {
        const context = await app.getContext();
        const userName = context?.user?.userPrincipalName.split("@")[0];

        // Ensure we're running in a side panel
        if (context.page.frameContext !== FrameContexts.sidePanel) {
          setReady(false);
          setMessage("This tab only works in the side panel of a Teams meeting. Please join the meeting to use it.");
          return;
        }

        // Attempt to connect to the Fluid relay service
        await FluidService.connect();
        const people = await FluidService.getPersonList();
        setReady(true);
        setMessage("");
        setUserName(userName);
        setPeople(people.people);

        // Register an event handler to update state when fluid data changes
        FluidService.onNewData((people) => {
          setReady(true);
          setPeople(null);
          setPeople(people.people);
          setMessage("");
        });

        initializeIcons();
      } catch (error) {
        // Display any errors encountered while connecting to Fluid service
        setReady(false);
        setMessage(`ERROR: ${error.message}`);
      }
    });
  };

  useEffect(() => {
    initialize();
  }, []);

  const {
    //presenceStarted, // boolean that is true once presence.initialize() is called
    //localUser, // local user presence object
    //users, // user presence array
    localUserHasRoles, // boolean that is true if local user is in one of the allowed roles
  } = liveShareHooks.usePresence(
    presence,
    ALLOWED_ROLES
  );

  //on text change in input box
  const inputChange = (e) => {
    setAddedName(e.target.value);
  };

  //on key down enter in input box
  const keyDown = async (e) => {
    if (e.key === "Enter") {
      try {
        await FluidService.addPerson(e.target.value);
        setAddedName("");
        setMessage("");
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  const shareToStage = () => {
    if (inTeams()) {
      meeting.shareAppContentToStage((error, result) => {
        if (!error) {
          console.log("Started sharing to stage");
        } else {
          console.warn("shareAppContentToStage failed", error);
        }
      }, window.location.origin + "?inTeams=1&view=stage");
    }
  };

  // const shareImageToStage = () => {
  //   if (inTeams()) {
  //     meeting.shareAppContentToStage((error, result) => {
  //       if (!error) {
  //         console.log("Started sharing to stage");
  //       } else {
  //         console.warn("shareAppContentToStage failed", error);
  //       }
  //     }, window.location.origin + "/index.html#/imageshare?inTeams=1&view=stage");
  //   }
  // };

  const getChangedPos = useCallback((currentPos, newPos) => {
    //console.log(currentPos, newPos);
    fluidLiveShare.reorderPeople(people, currentPos, newPos);
  }, [people]);

  // const widthStyles = {
  //   maxWidth: "280px"
  // };

  const DraggableRender = useCallback(() => {
    if (people && people.length) {
      return (
        <Draggable onPosChange={getChangedPos}>
          {people.map((item, index) => {
            return (
              <span style={{ display: "flex", width: "200px", borderLeft: `4px solid ${index > 0 ? 'orange' : 'green'}`, borderRadius: '0px' }} key={index} className="list-item">
                {item.name}
                {localUserHasRoles === true &&
                  <FontIcon iconName="Delete" className="close" onClick={async () => {
                    await FluidService.removePerson(item.name);
                  }} />
                }
              </span>
            );
          })
          }
        </Draggable>
      );
    }
    return null;
  }, [people, localUserHasRoles, getChangedPos]);

  if (!ready) {
    // We're not ready so just display the message
    return (
      <div>
        {/* Heading */}
        <h1>Live patient review</h1>
        <br />

        {/* Message */}
        <div className="message">{message}</div>
      </div>
    );
  } else {
    // We're ready; render the whole UI
    return (
      <div className="speaker-list">
        <h4>Welcome to Contoso Medicare</h4>

        {/* Heading */}
        <h1>Live patient review</h1>

        {/* Current speaker (if any) */}
        {
          people && people.length > 0 && (
            <div className="speaker-box">
              <h2>Current patient:</h2>
              <h1 className="reveal-text">{people[0].name}</h1>
            </div>
          )
        }

        {
          localUserHasRoles &&
          <>
            <h2>Add new patients</h2>
            <div className="add-name">
              <input
                type="text"
                onChange={(e) => inputChange(e)}
                onKeyDown={(e) => keyDown(e)}
                value={addedName}
              />
              <button
                type="submit"
                onClick={async () => {
                  try {
                    await FluidService.addPerson(addedName || userName);
                    setAddedName("");
                    setMessage("");
                  } catch (error) {
                    setMessage(error.message);
                  }
                }}
              >
                <FontIcon className="addbutton" iconName="Add" />
              </button>
              <div className="message">{message}</div>
              <hr />
            </div>
          </>
        }

        {/* List heading */}
        <div className="display-list">
          {people && people.length > 0 && (
            <div>
              <div className="people-list ">
                {/* List of people waiting to speak  */}
                {<DraggableRender />}
              </div>
            </div>
          )}
        </div>

        {
          localUserHasRoles &&
          /* Who's next button */
          <div>
            <PrimaryButton iconProps={{ iconName: "Next" }} onClick={async () => {
              await FluidService.nextPerson();
            }}>Next patient</PrimaryButton>
          </div>
        }

        {
          localUserHasRoles &&
          /* Shuffle button */
          <>
            {/* <div>
              <button
                className="shuffle"
                onClick={async () => {
                  await FluidService.shuffle();
                }}
              >
                Shuffle
              </button>
            </div> */}
            <p>
              <PrimaryButton iconProps={{ iconName: "ShareiOS" }} onClick={() => shareToStage()}>Share To Stage</PrimaryButton>
            </p>
            {/* <p>
              <PrimaryButton iconProps={{ iconName: "ShareiOS" }} onClick={() => shareImageToStage()}>Share Image</PrimaryButton>
            </p> */}
          </>
        }
      </div >
    );
  }
}

//export default WhosNextTab;
