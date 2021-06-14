import RemoteStreamSelector from './RemoteStreamSelector';

let remoteStreamSelector: RemoteStreamSelector;
let mockStartTimeInMilliseconds = 1000000000000;

const mockDispatch = jest.fn((action) => action.dominantParticipants[0].displayName);
Date.now = jest.fn(() => mockStartTimeInMilliseconds++);
console.log = jest.fn();

beforeAll(() => {
  remoteStreamSelector = RemoteStreamSelector.getInstance(1, mockDispatch as any);
  remoteStreamSelector.participantStateChanged('1', 'user1', 'Connected', false, false);
  remoteStreamSelector.participantStateChanged('2', 'user2', 'Connected', false, false);
  remoteStreamSelector.participantStateChanged('3', 'user3', 'Connected', false, false);
  remoteStreamSelector.processCommands();
});

test('For non-video participants, precedence to the unmuted', () => {
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user2');
});

test('For non-video participants, precedence to participants who have unmuted the latest', () => {
  remoteStreamSelector.participantAudioChanged('1', true);
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.participantAudioChanged('3', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user3');
});

test('For non-video participants, if latest unmuted participant have muted themselves later, precedence is updated to second latest unmuted', () => {
  remoteStreamSelector.participantAudioChanged('1', true);
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.participantAudioChanged('2', false);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user1');
});

test('Video participants should take the top precedence, even if muted and others unmuted.', () => {
  remoteStreamSelector.participantAudioChanged('1', true);
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.participantVideoChanged('3', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user3');
});

test('For video participants, precedence to unmuted participants', () => {
  remoteStreamSelector.participantVideoChanged('1', true);
  remoteStreamSelector.participantVideoChanged('2', true);
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.participantVideoChanged('3', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user2');
});

test('For video participants, if all participants are unmuted, precedence to participants who have unmuted the latest', () => {
  remoteStreamSelector.participantVideoChanged('1', true);
  remoteStreamSelector.participantVideoChanged('2', true);
  remoteStreamSelector.participantAudioChanged('2', true);
  remoteStreamSelector.participantVideoChanged('3', true);
  remoteStreamSelector.participantAudioChanged('3', true);
  remoteStreamSelector.participantAudioChanged('1', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user1');
});

test('For video participants, if all participants are muted, priority to the first participant who turned on thier camera', () => {
  remoteStreamSelector.participantVideoChanged('1', true);
  remoteStreamSelector.participantVideoChanged('2', true);
  remoteStreamSelector.participantVideoChanged('3', true);
  remoteStreamSelector.processCommands();

  expect(mockDispatch).toReturnWith('user1');
});

// Reset all participants to default video off & muted.
afterEach(() => {
  remoteStreamSelector.participantVideoChanged('1', false);
  remoteStreamSelector.participantVideoChanged('2', false);
  remoteStreamSelector.participantVideoChanged('3', false);
  remoteStreamSelector.participantAudioChanged('1', false);
  remoteStreamSelector.participantAudioChanged('2', false);
  remoteStreamSelector.participantAudioChanged('3', false);
  remoteStreamSelector.processCommands();
});
