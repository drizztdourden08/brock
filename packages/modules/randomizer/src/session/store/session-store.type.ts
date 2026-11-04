/* @layer core @kind types */
import type { RandomizerSession, SessionStatus } from '../local/randomizer-session.type';

interface SessionStoreState {
  session: RandomizerSession | null;
  placement: unknown;
  status: SessionStatus;
  setSession(session: RandomizerSession | null, placement?: unknown): void;
  setStatus(status: SessionStatus): void;
}

export type { SessionStoreState };
