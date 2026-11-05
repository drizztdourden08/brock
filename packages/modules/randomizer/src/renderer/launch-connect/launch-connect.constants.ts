/* @layer renderer-shell @kind constants */
import type { ConnectionVerdict, LaunchMode } from './launch-connect.type';

const ROOM_WAIT_MS = 15 * 60_000;

const ROOM_POLL_MS = 500;

const ROOM_NOTE_MS = 30_000;

const CONNECTION_WAIT_MS = 5 * 60_000;

const LOBBY_GIVEN_UP_STATES: ReadonlySet<string> = new Set(['failed', 'refused', 'gone']);

const MODE_WORDS: Record<LaunchMode, string> = { online: 'an Archipelago (online)', archipelia: 'an Archipelia' };

const CONNECTION_FAILURE_TEXT: Readonly<Record<Exclude<ConnectionVerdict, 'connected' | 'cancelled'>, string>> = {
  failed: 'The Archipelago client stopped before it connected',
  'timed-out': 'The Archipelago client did not connect within 5 minutes',
};

export {
  CONNECTION_FAILURE_TEXT,
  CONNECTION_WAIT_MS,
  LOBBY_GIVEN_UP_STATES,
  MODE_WORDS,
  ROOM_NOTE_MS,
  ROOM_POLL_MS,
  ROOM_WAIT_MS,
};
