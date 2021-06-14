import { connect } from 'react-redux';
import MediaGallery from '../components/MediaGallery';
import { State } from '../core/reducers';

const mapStateToProps = (state: State) => ({
  userId: state.sdk.userId,
  displayName: state.calls.callAgent?.displayName,
  remoteParticipants: state.calls.remoteParticipants,
  dominantParticipants: state.calls.dominantParticipants,
  localVideoStream: state.streams.localVideoStream
});

const connector: any = connect(mapStateToProps);
export default connector(MediaGallery);
