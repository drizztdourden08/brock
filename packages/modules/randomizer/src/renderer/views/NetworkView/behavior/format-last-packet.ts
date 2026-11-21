/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { UNKNOWN_LABEL } from '../NetworkView.constants';

const formatLastPacket = (at: number | undefined, text: (value: Text) => string): string =>
  (at === undefined ? text(UNKNOWN_LABEL) : formatDate(at, 'time', { length: 'medium' }));

export { formatLastPacket };
