/* @layer core @kind types */
import type { RandomizerSession, SessionStatus } from '../local/randomizer-session.type';

interface SessionStoreState {
  session: RandomizerSession | null;
  status: SessionStatus;
  setSession: (session: RandomizerSession | null) => void;
  setStatus: (status: SessionStatus) => void;
}

export type { SessionStoreState };
