/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ActivityKind } from './activity.type';

const ACTIVITY_KINDS: readonly ActivityKind[] = [
  { id: 'session', label: msg('randomizer:activity.kind.session'), tone: 'primary', toneMessage: true, strong: true },
  { id: 'plan', label: msg('randomizer:activity.kind.plan'), tone: 'info', toneMessage: true },
  { id: 'deliver', label: msg('randomizer:activity.kind.deliveries'), tone: 'primary', toneMessage: true },
  { id: 'check', label: msg('randomizer:activity.kind.checks'), tone: 'secondary' },
  { id: 'online', label: msg('randomizer:activity.kind.connection'), tone: 'info' },
  { id: 'item', label: msg('randomizer:activity.kind.item'), tone: 'green' },
  { id: 'hint', label: msg('randomizer:activity.kind.hint'), tone: 'amber' },
  { id: 'chat', label: msg('randomizer:activity.kind.chat'), tone: 'blue' },
  { id: 'server', label: msg('randomizer:activity.kind.server'), tone: 'violet' },
  { id: 'join', label: msg('randomizer:activity.kind.join'), tone: 'teal' },
  { id: 'info', label: msg('randomizer:activity.kind.info'), tone: 'muted' },
  { id: 'warn', label: msg('randomizer:activity.kind.warnings'), tone: 'warning', toneMessage: true },
  { id: 'error', label: msg('randomizer:activity.kind.errors'), tone: 'danger', toneMessage: true },
];

const GAME_KIND_TONE = 'dim';

export { ACTIVITY_KINDS, GAME_KIND_TONE };
