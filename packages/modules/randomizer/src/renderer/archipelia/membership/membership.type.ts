/* @layer renderer-shell @kind types */
import type { LobbyRef, LobbyStart } from '../../../archipelago/lobby';

type GoneReason = 'closed' | 'not-found' | 'resume-invalid' | 'unsupported';

type MembershipState =
  | { kind: 'pending' }
  | { kind: 'approved' }
  | { kind: 'failed'; message: string }
  | { kind: 'refused'; reason: string }
  | { kind: 'gone'; reason: GoneReason }
  | { kind: 'started' };

type ArchipeliaMembership = {
  server: string;
  lobby: LobbyRef;
  ap: string;
  lobbyName: string;
  memberId: string;
  token?: string;
  state: MembershipState;
  updatedAt: number;
};

type MembershipStep = {
  membership: ArchipeliaMembership;
  promote: LobbyStart | null;
  room: string | null;
};

export type { ArchipeliaMembership, GoneReason, MembershipState, MembershipStep };
