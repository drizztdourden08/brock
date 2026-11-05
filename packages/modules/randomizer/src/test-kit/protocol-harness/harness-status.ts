/* @layer core @kind logic */
import type { ConnectionState } from '../../archipelago';
import { ONLINE_PREFIX } from './harness-status.constants';

const connectionErrorOf = (state: ConnectionState, reason: string): string | null =>
  state === 'refused' ? reason.replace(ONLINE_PREFIX, '') : null;

export { connectionErrorOf };
