import { setDominantParticipants } from './actions/calls';
import { Dispatch } from 'redux';
import { RemoteParticipantState } from '@azure/communication-calling';

interface Event {
  participantId: string;
  timeStamp: number;
  process: Function;
}

class AudioChangedEvent implements Event {
  participantId: string;
  timeStamp: number;
  isUnMuted: boolean = false;

  constructor(participantId: string, isUnMuted: boolean) {
    this.participantId = participantId;
    this.isUnMuted = isUnMuted;
    this.timeStamp = Date.now();
  }

  process(participant: SelectionState): void {
    if (this.isUnMuted && !participant.isUnMuted) {
      participant.lastUnMuted = this.timeStamp;
    }
    participant.isUnMuted = this.isUnMuted;
  }
}

class VideoChangedEvent implements Event {
  participantId: string;
  timeStamp: number;
  isVideoOn: boolean = false;

  constructor(participantId: string, isVideoOn: boolean) {
    this.participantId = participantId;
    this.isVideoOn = isVideoOn;
    this.timeStamp = Date.now();
  }

  process(participant: SelectionState): void {
    participant.isVideoOn = this.isVideoOn;
  }
}

export class SelectionState {
  isVideoOn: boolean;
  isUnMuted: boolean;
  lastUnMuted: number;
  participantId: string;
  displayName: string;

  constructor(participantId: string, displayName: string, isUnMuted: boolean = false, isVideoOn: boolean = false) {
    this.participantId = participantId;
    this.displayName = displayName;
    this.isUnMuted = isUnMuted;
    this.isVideoOn = isVideoOn;
    this.lastUnMuted = -1;
  }
}

export default class RemoteStreamSelector {
  private readonly dominantParticipantsCount: number;
  private readonly dipatch: Dispatch;
  private batchedCommands: Event[];
  private remoteParticipants: Map<string, SelectionState>;
  private static ProcessingDelayInSeconds = 2000;
  private static Singleton: RemoteStreamSelector;

  constructor(dominantParticipantsCount: number, dispatch: Dispatch) {
    this.dominantParticipantsCount = dominantParticipantsCount;
    this.dipatch = dispatch;
    this.batchedCommands = [];
    this.remoteParticipants = new Map();

    setInterval(
      () => this.batchedCommands.length > 0 && this.processCommands(),
      RemoteStreamSelector.ProcessingDelayInSeconds
    );
  }

  private compareFn = (a: SelectionState, b: SelectionState) => {
    if (a.isVideoOn === b.isVideoOn) {
      if (a.isUnMuted === b.isUnMuted) return b.lastUnMuted - a.lastUnMuted;
      return a.isUnMuted ? -1 : 1;
    }
    return a.isVideoOn ? -1 : 1;
  };

  public processCommands = (commands = this.batchedCommands): void => {
    commands.forEach((command) => {
      let participant = this.remoteParticipants.get(command.participantId);
      if (!participant) {
        console.error(`RemoteStreamSelector: Participant ${command.participantId} not found`);
        return;
      }
      command.process(participant);
    });
    this.batchedCommands = [];

    let sortedList = [...this.remoteParticipants.values()].sort(this.compareFn);
    console.log('RemoteStreamSelector: Participants sorted list', sortedList);

    this.dipatch(setDominantParticipants(sortedList.slice(0, this.dominantParticipantsCount)));
  };

  public participantAudioChanged = (participantId: string, isUnmuted: boolean): void => {
    this.batchedCommands.push(new AudioChangedEvent(participantId, isUnmuted));
  };

  public participantVideoChanged = (participantId: string, isVideoOn: boolean): void => {
    this.batchedCommands.push(new VideoChangedEvent(participantId, isVideoOn));
  };

  public participantStateChanged = (
    participantId: string,
    displayName: string,
    state: RemoteParticipantState,
    isUnMuted: boolean,
    isVideoOn: boolean
  ): void => {
    switch (state) {
      case 'Connecting':
        this.remoteParticipants.set(
          participantId,
          new SelectionState(participantId, displayName, isUnMuted, isVideoOn)
        );
        break;
      case 'Connected':
        this.remoteParticipants.set(
          participantId,
          new SelectionState(participantId, displayName, isUnMuted, isVideoOn)
        );
        this.participantAudioChanged(participantId, isUnMuted);
        this.participantVideoChanged(participantId, isVideoOn);
        break;
      case 'Disconnected':
        this.remoteParticipants.delete(participantId);
        this.processCommands(); // Force update Redux list with removed participant.
        break;
    }
  };

  public static getInstance = (dominantParticipantsCount: number, dispatch: Dispatch): RemoteStreamSelector =>
    (RemoteStreamSelector.Singleton = RemoteStreamSelector.Singleton ?? new RemoteStreamSelector(dominantParticipantsCount, dispatch));
}
