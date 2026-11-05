/* @layer core @kind test */
import type { LobbyJoinState, LobbyStart, StartedRoom } from '../src/archipelago/lobby';
import type { ArchipeliaMembership } from '../src/renderer/archipelia/membership/membership.type';

const JOIN_STATE: LobbyJoinState = {
  status: 'approved',
  token: 'token-1',
  memberId: 'member-1',
  resumed: false,
  trust: null,
  admission: 'approved',
  admissionReason: null,
  lobby: null,
  phase: null,
  uploads: [],
  uploadsDone: true,
  slots: [],
  others: null,
  ready: false,
  progress: null,
  generationFailure: null,
  started: null,
  room: null,
  problem: null,
  failure: null,
  reconnecting: false,
  end: null,
  forgetToken: false,
};

const MEMBERSHIP: ArchipeliaMembership = {
  server: 'lobby.example.org',
  lobby: { joinToken: 'join-token-1' },
  ap: '0.6.1',
  lobbyName: 'Toy lobby',
  memberId: 'member-1',
  token: 'token-1',
  state: { kind: 'approved' },
  updatedAt: 1,
};

const REMOTE_ROOM: StartedRoom = { address: 'room.example.org:38281', host: 'room.example.org', port: 38281, tls: 'no' };

const LOCAL_ROOM: StartedRoom = { ...REMOTE_ROOM, localAddress: '192.168.1.5:38281' };

const STARTED: LobbyStart = {
  seed: 'seed-1',
  engine: { ap: '0.6.1' },
  room: LOCAL_ROOM,
  slots: [{ name: 'Player', game: 'Toy Game', team: 0, files: [] }],
};

export { JOIN_STATE, LOCAL_ROOM, MEMBERSHIP, REMOTE_ROOM, STARTED };
