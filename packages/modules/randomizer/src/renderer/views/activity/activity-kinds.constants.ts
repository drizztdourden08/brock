/* @layer renderer-shell @kind constants */
import type { LogKindDef } from '@drizztdourden08/tessera/composites';

const ACTIVITY_KINDS: readonly LogKindDef[] = [
  { id: 'session', label: 'Session', tone: 'primary', toneMessage: true, strong: true },
  { id: 'plan', label: 'Plan', tone: 'info', toneMessage: true },
  { id: 'deliver', label: 'Deliveries', tone: 'primary', toneMessage: true },
  { id: 'check', label: 'Checks', tone: 'secondary' },
  { id: 'online', label: 'Connection', tone: 'info' },
  { id: 'item', label: 'Item', tone: 'green' },
  { id: 'hint', label: 'Hint', tone: 'amber' },
  { id: 'chat', label: 'Chat', tone: 'blue' },
  { id: 'server', label: 'Server', tone: 'violet' },
  { id: 'join', label: 'Join', tone: 'teal' },
  { id: 'info', label: 'Info', tone: 'muted' },
  { id: 'warn', label: 'Warnings', tone: 'warning', toneMessage: true },
  { id: 'error', label: 'Errors', tone: 'danger', toneMessage: true },
];

const GAME_KIND_TONE = 'dim';

export { ACTIVITY_KINDS, GAME_KIND_TONE };
