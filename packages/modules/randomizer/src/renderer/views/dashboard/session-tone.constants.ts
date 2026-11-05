/* @layer renderer-shell @kind constants */
import type { StatusTone } from '@drizztdourden08/tessera/primitives';
import type { SessionStatus } from '../../../session';

const SESSION_TONE: Readonly<Record<SessionStatus, StatusTone>> = {
  idle: 'neutral',
  starting: 'warning',
  reconnecting: 'warning',
  active: 'success',
  error: 'danger',
};

export { SESSION_TONE };
