/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { UNKNOWN_LABEL } from '../NetworkView.constants';

const formatLastPacket = (at: number | undefined): string => (at === undefined ? UNKNOWN_LABEL : formatDate(at, 'time', { length: 'medium' }));

export { formatLastPacket };
