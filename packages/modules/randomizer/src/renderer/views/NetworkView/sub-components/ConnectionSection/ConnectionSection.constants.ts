/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ConnectionState } from '../../../../../archipelago';
import type { ConnectionStatusDef } from '../../NetworkView.type';

const CONNECTION_STATUS = {
  idle: { label: msg('randomizer:network.status.idle'), tone: 'neutral' },
  connecting: { label: msg('randomizer:network.status.connecting'), tone: 'info', pulse: true },
  connected: { label: msg('randomizer:network.status.connected'), tone: 'success' },
  reconnecting: { label: msg('randomizer:network.status.reconnecting'), tone: 'warning', pulse: true },
  refused: { label: msg('randomizer:network.status.refused'), tone: 'danger' },
  closed: { label: msg('randomizer:network.status.closed'), tone: 'neutral' },
} as const satisfies Record<ConnectionState, ConnectionStatusDef>;

const CONNECTION_TITLE = msg('randomizer:network.connection.title');
const STATE_LABEL = msg('randomizer:network.connection.state');

export { CONNECTION_STATUS, CONNECTION_TITLE, STATE_LABEL };
