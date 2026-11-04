/* @layer renderer-shell @kind constants */
import type { StatusMap } from '@drizztdourden08/tessera/primitives';
import type { ConnectionState } from '../../../../../archipelago';

const CONNECTION_STATUS = {
  idle: { label: 'Not connected', tone: 'neutral' },
  connecting: { label: 'Connecting', tone: 'info', pulse: true },
  connected: { label: 'Connected', tone: 'success' },
  reconnecting: { label: 'Reconnecting', tone: 'warning', pulse: true },
  refused: { label: 'Refused', tone: 'danger' },
  closed: { label: 'Closed', tone: 'neutral' },
} as const satisfies StatusMap<ConnectionState>;

const CONNECTION_TITLE = 'Connection';
const STATE_LABEL = 'State';

export { CONNECTION_STATUS, CONNECTION_TITLE, STATE_LABEL };
