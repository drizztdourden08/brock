/* @layer renderer-shell @kind constants */
import type { MessageKind } from '../../../archipelago';

const RECENT_LIMIT = 8;
const RECENT_HEIGHT = 208;
const KEPT_KINDS: ReadonlySet<string> = new Set(['session', 'check', 'deliver', 'online', 'warn', 'error', 'item', 'join']);
const KEPT_INFO = /Received:|DeathLink|goal/i;
const KEPT_ALWAYS: ReadonlySet<MessageKind> = new Set<MessageKind>(['item', 'join']);
const GOAL_LINE = /goal/i;

export { GOAL_LINE, KEPT_ALWAYS, KEPT_INFO, KEPT_KINDS, RECENT_HEIGHT, RECENT_LIMIT };
