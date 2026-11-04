/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const LOG_KINDS: readonly LogKindDef[] = [
  { id: 'info', label: 'Info', tone: 'secondary' },
  { id: 'warn', label: 'Warn', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Error', tone: 'danger', toneMessage: true },
  { id: 'item', label: 'Item', tone: 'green' },
  { id: 'hint', label: 'Hint', tone: 'amber' },
  { id: 'chat', label: 'Chat', tone: 'blue' },
  { id: 'server', label: 'Server', tone: 'violet' },
  { id: 'join', label: 'Join', tone: 'teal' },
];

const LOG_COUNT_LABEL = 'entries';
const LOG_EMPTY_LABEL = 'No activity yet.';
const ROOM_TAG = 'ROOM';
const SAY_PLACEHOLDER = 'Say something, or type !hint';

export { LOG_COUNT_LABEL, LOG_EMPTY_LABEL, LOG_KINDS, ROOM_TAG, SAY_PLACEHOLDER };
