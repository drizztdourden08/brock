/* @layer core @kind constants */
import type { ConnectionState } from '../../archipelago';
import type { HarnessStatus } from './harness-session.type';

const ONLINE_PREFIX = '[Online] ';

const STATUS_OF: Record<ConnectionState, HarnessStatus> = {
  idle: 'idle',
  closed: 'idle',
  connecting: 'connecting',
  connected: 'active',
  reconnecting: 'reconnecting',
  refused: 'error',
};

export { ONLINE_PREFIX, STATUS_OF };
