import { connect } from 'react-redux';
import { removeParticipant } from '../core/sideEffects';
import { State } from '../core/reducers';
import ParticipantStack from '../components/ParticipantStack';
import { CommunicationUserKind} from '@azure/communication-common';

const mapStateToProps = (state: State) => ({
  userId: state.sdk.userId,
  displayName: state.calls.callAgent?.displayName,
  call: state.calls.call,
  callState: state.calls.callState,
  remoteParticipants: state.calls.remoteParticipants,
  screenShareStreams: state.streams.screenShareStreams,
  removeParticipant: (user: CommunicationUserKind | undefined) => {
    if (state.calls.call && user) {
      removeParticipant(state.calls.call, user);
    }
  }
});

const connector: any = connect(mapStateToProps);
export default connector(ParticipantStack);
