/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  LivePresence,
  UserMeetingRole,
  PresenceState,
} from "@microsoft/live-share";
import { useState, useEffect, useRef, useMemo } from "react";

/**
* Hook for tracking users, roles, and who is in control
*
* @remarks
*
* @param {LivePresence} presence presence object from Fluid container.
* @param {UserMeetingRole[]} allowedRoles List of acceptable roles for playback transport commands.
* @returns `{started, localUser, users, presentingUser, localUserIsEligiblePresenter, localUserIsPresenting, takeControl}` where:
* - `presenceStarted` is a boolean indicating whether `presence.initialize()` has been called.
* - `localUser` is the local user's presence object.
* - `users` is an array of user presence objects in the session.
* - `localUserHasRoles` is a boolean indicating whether the local user is an eligible presenter.
*/
export const usePresence = (
  presence,
  allowedRoles
) => {
  const startedInitializingRef = useRef(false);
  const usersRef = useRef([]);
  const [users, setUsers] = useState(usersRef.current);
  const [localUser, setLocalUser] = useState();
  const [presenceStarted, setStarted] = useState(false);

  // Local user is an eligible presenter
  const localUserHasRoles = useMemo(() => {
    if (allowedRoles.length === 0) {
      return true;
    }
    if (!presence || !localUser) {
      return false;
    }
    return (
      localUser.roles.filter((role) =>
        allowedRoles.includes(role)
      ).length > 0
    );
  }, [allowedRoles, presence, localUser]);

  // Effect which registers SharedPresence event listeners before joining space
  useEffect(() => {
    if (
      (presence && presence.presence === null) ||
      //!context ||
      startedInitializingRef.current
    ) {
      return;
    }

    startedInitializingRef.current = true;
    // Register presenceChanged event listener
    presence.presence.on("presenceChanged", (userPresence, local) => {
      console.log("usePresence: presence received", userPresence, local);
      if (local) {
        setLocalUser(userPresence);
      }
      // Set users local state
      const userArray = presence.presence.toArray(PresenceState.online);
      // Need to create new array so that React knows the user list changed.
      setUsers([...userArray]);
    });
    // const userData = {
    //     joinedTimestamp: timestampProvider?.getTimestamp(),
    // };


    presence.presence
      .initialize()
      .then(() => {
        console.log("usePresence: started presence");
        setStarted(true);
      })
      .catch((error) => console.error(error));
  }, [presence, setUsers, setLocalUser]);

  return {
    presenceStarted,
    localUser,
    users,
    localUserHasRoles
  };
};