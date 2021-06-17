import { Reducer } from 'redux';
import { SET_USERID, SdkTypes, SET_DISPLAY_NAME } from '../actions/sdk';

export interface SdkState {
  userId?: string;
  displayName: string;
}

const initialState: SdkState = {
  displayName: ''
};

export const sdkReducer: Reducer<SdkState, SdkTypes> = (state = initialState, action: SdkTypes): SdkState => {
  switch (action.type) {
    case SET_USERID:
      return { ...state, userId: action.userId };
    case SET_DISPLAY_NAME:
      return { ...state, displayName: action.displayName };
    default:
      return state;
  }
};
