/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { UNKNOWN_LABEL } from '../../NetworkView.constants';

const formatPing = (pingMs: number | undefined): string => (pingMs === undefined ? UNKNOWN_LABEL : `${Math.round(pingMs)} ms`);

const formatLastPacket = (at: number | undefined): string => (at === undefined ? UNKNOWN_LABEL : formatDate(at, 'time', { length: 'medium' }));

export { formatLastPacket, formatPing };
