const SET_USERID = 'SET_USERID';
const SET_DISPLAY_NAME = 'SET_DISPLAY_NAME';

interface SetUserIdAction {
  type: typeof SET_USERID;
  userId: string;
}

interface SetDisplayNameAction {
  type: typeof SET_DISPLAY_NAME;
  displayName: string;
}

export const setUserId = (userId: string): SetUserIdAction => {
  return {
    type: SET_USERID,
    userId
  };
};

export const setDisplayName = (displayName: string): SetDisplayNameAction => {
  return {
    type: SET_DISPLAY_NAME,
    displayName
  };
};

export { SET_USERID, SET_DISPLAY_NAME };

export type SdkTypes = SetUserIdAction | SetDisplayNameAction;
