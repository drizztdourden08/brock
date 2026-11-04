/* @layer core @kind logic */
import type { ConnectionState } from '../../archipelago';
import type { SessionStatus } from '../local/randomizer-session.type';

const statusAfterEvent = (connection: ConnectionState): SessionStatus => {
  if (connection === 'refused') return 'error';
  if (connection === 'closed') return 'idle';
  return connection === 'connected' ? 'active' : 'reconnecting';
};

export { statusAfterEvent };
