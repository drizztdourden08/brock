/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import { UNKNOWN_LABEL } from '../NetworkView.constants';

const formatPing = (pingMs: number | undefined, text: (value: Text) => string): string =>
  (pingMs === undefined ? text(UNKNOWN_LABEL) : text(msg('randomizer:network.health.pingValue', { ms: Math.round(pingMs) })));

export { formatPing };
