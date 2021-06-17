import {
  AudioDeviceInfo,
  Call,
  CommunicationServicesError,
  TeamsMeetingLinkLocator,
  JoinCallOptions,
  DeviceManager,
  DeviceAccess,
  RemoteParticipant,
  VideoDeviceInfo,
  CallAgent,
  CallClient,
  HangUpOptions,
  CallEndReason
} from '@azure/communication-calling';
import {
  AzureCommunicationTokenCredential,
  CommunicationUserKind
} from '@azure/communication-common';
import { CommunicationUserToken } from '@azure/communication-identity';
import { Dispatch } from 'redux';
import { utils } from '../Utils/Utils';
import { callAdded, callRemoved, setCallState, setParticipants, setCallAgent } from './actions/calls';
import { setMic, setShareScreen } from './actions/controls';
import {
  setAudioDeviceInfo,
  setAudioDeviceList,
  setCameraPermission,
  setMicrophonePermission,
  setVideoDeviceInfo,
  setVideoDeviceList,
  setDeviceManager
} from './actions/devices';
import { setUserId } from './actions/sdk';
import { addScreenShareStream, removeScreenShareStream } from './actions/streams';
import { State } from './reducers';
import { setLogLevel } from '@azure/logger';
import RemoteStreamSelector from './RemoteStreamSelector';
import { Constants } from './constants';

export const setMicrophone = (mic: boolean) => {
  return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
    const state = getState();

    if (state === undefined || state.calls.call === undefined) {
      console.error('state or state.controls.mic is null');
      return;
    }

    try {
      if (!state.controls.mic) {
        await state.calls.call.unmute();
      } else {
        await state.calls.call.mute();
      }

      dispatch(setMic(mic));
    } catch (e) {
      console.error(e);
    }
  };
};

export const setShareUnshareScreen = (shareScreen: boolean) => {
  return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
    const state = getState();

    if (state === undefined || state.calls.call === undefined) {
      console.error('state or state.controls.shareScreen is null');
      return;
    }

    try {
      if (!state.controls.shareScreen) {
        await state.calls.call.startScreenSharing();
      } else {
        await state.calls.call.stopScreenSharing();
      }

      dispatch(setShareScreen(shareScreen));
    } catch (e) {
      console.error(e);
    }
  };
};

const subscribeToParticipant = (
  participant: RemoteParticipant,
  call: Call,
  dispatch: Dispatch
): void => {
  const remoteStreamSelector = RemoteStreamSelector.getInstance(Constants.DOMINTANT_PARTICIPANTS_COUNT, dispatch);

  participant.on('stateChanged', () => {
    remoteStreamSelector.participantStateChanged(
      utils.getId(participant.identifier),
      participant.displayName ?? '',
      participant.state, 
      !participant.isMuted, 
      participant.videoStreams[0].isAvailable);
    dispatch(setParticipants([...call.remoteParticipants.values()]));
  });

  participant.on('isMutedChanged', () => {
    remoteStreamSelector.participantAudioChanged(utils.getId(participant.identifier), !participant.isMuted);
  });

  participant.on('isSpeakingChanged', () => {
    dispatch(setParticipants([...call.remoteParticipants.values()]));
  });

  participant.on('videoStreamsUpdated', (e): void => {
    e.added.forEach((addedStream) => {
      if (addedStream.mediaStreamType === 'ScreenSharing') {
        addedStream.on('isAvailableChanged', () => {
          if (addedStream.isAvailable) {
            dispatch(addScreenShareStream(addedStream, participant));
          } else {
            dispatch(removeScreenShareStream(addedStream, participant));
          }
        });
  
        if (addedStream.isAvailable) { dispatch(addScreenShareStream(addedStream, participant)); }
      }
      else if (addedStream.mediaStreamType === 'Video') {
        addedStream.on('isAvailableChanged', () => {
          remoteStreamSelector.participantVideoChanged(utils.getId(participant.identifier), addedStream.isAvailable);
        });
      }
    });
    dispatch(setParticipants([...call.remoteParticipants.values()]));
  });
};

const updateAudioDevices = async (deviceManager: DeviceManager, dispatch: Dispatch, getState: () => State): Promise<void> => {
  const microphoneList: AudioDeviceInfo[] = await deviceManager.getMicrophones();
  dispatch(setAudioDeviceList(microphoneList));

  const state = getState();
  if (state.devices.audioDeviceInfo === undefined && microphoneList.length > 0) {
    dispatch(setAudioDeviceInfo(microphoneList[0]));
    deviceManager.selectMicrophone(microphoneList[0]);
  } else if (
    state.devices.audioDeviceInfo &&
    !utils.isSelectedAudioDeviceInList(state.devices.audioDeviceInfo, microphoneList)
  ) {
    deviceManager.selectMicrophone(state.devices.audioDeviceInfo);
  }
};

const updateVideoDevices = async (deviceManager: DeviceManager, dispatch: Dispatch, getState: () => State): Promise<void> => {
  const cameraList: VideoDeviceInfo[] = await deviceManager.getCameras();
  dispatch(setVideoDeviceList(cameraList));

  const state = getState();
  if (state.devices.videoDeviceInfo === undefined) {
    dispatch(setVideoDeviceInfo(cameraList[0]));
  } else if (
    state.devices.videoDeviceInfo &&
    !utils.isSelectedVideoDeviceInList(state.devices.videoDeviceInfo, cameraList)
  ) {
    dispatch(setVideoDeviceInfo(state.devices.videoDeviceInfo));
  }
};

const subscribeToDeviceManager = async (deviceManager: DeviceManager, dispatch: Dispatch, getState: () => State): Promise<void> => {
  // listen for any new events
  deviceManager.on('videoDevicesUpdated', async () => {
    updateVideoDevices(deviceManager, dispatch, getState);
  });

  deviceManager.on('audioDevicesUpdated', async () => {
    updateAudioDevices(deviceManager, dispatch, getState);
  });

  deviceManager.askDevicePermission({ audio: true,  video: true}).then((e: DeviceAccess) => {
    if (e.audio !== undefined) {
      if (e.audio) {
        dispatch(setMicrophonePermission('Granted'));

        updateAudioDevices(deviceManager, dispatch, getState);
      } else {
        dispatch(setMicrophonePermission('Denied'));
      }
    }

    if (e.video !== undefined) {
      if (e.video) {
        dispatch(setCameraPermission('Granted'));
        updateVideoDevices(deviceManager, dispatch, getState);
      } else {
        dispatch(setCameraPermission('Denied'));
      }
    }
  });
};

export const updateDevices = () => {
  return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
    const state = getState();
    const deviceManager = state.devices.deviceManager;

    if (deviceManager == null) {
      console.error('no device manager available');
      return;
    }

    const cameraList: VideoDeviceInfo[] = await deviceManager.getCameras();

    dispatch(setVideoDeviceList(cameraList));

    const microphoneList: AudioDeviceInfo[] = await deviceManager.getMicrophones();

    dispatch(setAudioDeviceList(microphoneList));
  };
};

export const initCallAgent = (name: string, callEndedHandler: (reason: CallEndReason) => void) => {
  return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
    setLogLevel('verbose');
    const callClient = new CallClient();

    const tokenResponse: CommunicationUserToken = await utils.getTokenForUser();
    const userToken = tokenResponse.token;
    const userId = tokenResponse.user.communicationUserId
    dispatch(setUserId(userId));
    
    const tokenCredential = new AzureCommunicationTokenCredential({
      tokenRefresher: (): Promise<string> => {
        return utils.getRefreshedTokenForUser(userId)
      },
      refreshProactively: true,
      token: userToken
    });
    const callAgent: CallAgent = await callClient.createCallAgent(tokenCredential, { displayName: name });

    if (callAgent === undefined) {
      return;
    }

    dispatch(setCallAgent(callAgent));

    callAgent.on('callsUpdated', (e: { added: Call[]; removed: Call[] }): void => {
      e.added.forEach((addedCall) => {

        console.log(`Call added : Call Id = ${addedCall.id}`)

        const state = getState();
        if (state.calls.call && addedCall.direction === 'Incoming') {
          addedCall.hangUp();
          return;
        }

        dispatch(callAdded(addedCall));

        addedCall.on('stateChanged', (): void => {
          dispatch(setCallState(addedCall.state));
        });

        dispatch(setCallState(addedCall.state));

        addedCall.on('isScreenSharingOnChanged', (): void => {
          dispatch(setShareScreen(addedCall.isScreenSharingOn));
        });

        dispatch(setShareScreen(addedCall.isScreenSharingOn))
        
        // if remote participants have changed, subscribe to the added remote participants
        addedCall.on('remoteParticipantsUpdated', (ev): void => {
          // for each of the added remote participants, subscribe to events and then just update as well in case the update has already happened
          ev.added.forEach((addedRemoteParticipant) => {
            subscribeToParticipant(addedRemoteParticipant, addedCall, dispatch);
            dispatch(setParticipants([...state.calls.remoteParticipants, addedRemoteParticipant]));
          });

          // We don't use the actual value we are just going to reset the remoteParticipants based on the call
          if (ev.removed.length > 0) {
            dispatch(setParticipants([...addedCall.remoteParticipants.values()]));
          }
        });

        dispatch(setParticipants([...state.calls.remoteParticipants]));
      });
      e.removed.forEach((removedCall) => {
        const state = getState();
        if (state.calls.call && state.calls.call === removedCall) {
          dispatch(callRemoved(removedCall, state.calls.group));
          if (removedCall.callEndReason && removedCall.callEndReason.code !== 0) {
            removedCall.callEndReason && callEndedHandler(removedCall.callEndReason);
          }
        }
      });
    });
  }
}

export const initCallClient = (unsupportedStateHandler: () => void) => {
  return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
      let callClient;

      // check if chrome on ios OR firefox browser
      if (utils.isOnIphoneAndNotSafari() || utils.isUnsupportedBrowser()) {
        unsupportedStateHandler();
        return;
      }

      try {
        setLogLevel('verbose')
        callClient = new CallClient();
      } catch (e) {
        unsupportedStateHandler();
        return;
      }

      if (!callClient) {
        return;
      }

      const deviceManager: DeviceManager = await callClient.getDeviceManager();

      dispatch(setDeviceManager(deviceManager));
      subscribeToDeviceManager(deviceManager, dispatch, getState);
  };
}

// what does the forEveryone parameter really mean?
export const endCall = async (call: Call, options: HangUpOptions): Promise<void> => {
  await call.hangUp(options).catch((e: CommunicationServicesError) => console.error(e));
};

export const joinGroup = async (callAgent: CallAgent, context:  TeamsMeetingLinkLocator, callOptions: JoinCallOptions): Promise<void> => {
  try {
    await callAgent.join(context, callOptions);
  } catch (e) {
    console.log('Failed to join a call', e);
    return;
  }
};

export const addParticipant = async (call: Call, user: CommunicationUserKind): Promise<void> => {
  await call.addParticipant(user);
};

export const removeParticipant = async (
  call: Call,
  user: CommunicationUserKind
): Promise<void> => {
  await call.removeParticipant(user).catch((e: CommunicationServicesError) => console.error(e));
};
