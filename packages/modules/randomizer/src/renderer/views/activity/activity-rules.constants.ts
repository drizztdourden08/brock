/* @layer renderer-shell @kind constants */
import type { LogRule } from '../../../contract/randomizer-views.type';
import type { ActivityClass } from './activity.type';

const ACTIVITY_RULES: readonly LogRule[] = [
  { pattern: /Starting session/, kind: 'session', tag: 'START' },
  { pattern: /Session armed/, kind: 'session', tag: 'ARMED' },
  { pattern: /Session stopped|Session refused/, kind: 'session', tag: 'STOP' },
  { pattern: /^\[[^\]]+] Plan|plan errors|Plan summary|locations planned/i, kind: 'plan', tag: 'PLAN' },
  { pattern: /delivering "|Delivery |Delivered /, kind: 'deliver', tag: 'DELIV' },
  { pattern: /Check completed/, kind: 'check', tag: 'CHECK' },
  { pattern: /Connected|Disconnected|socket|slot |server/i, kind: 'online', tag: 'NET' },
  { pattern: /Placement generated|Generation failed/, kind: 'plan', tag: 'GEN' },
];

const ROOM_TAG = 'ROOM';
const ERROR_CLASS: ActivityClass = { kind: 'error', tag: 'ERROR' };
const WARN_CLASS: ActivityClass = { kind: 'warn', tag: 'WARN' };
const INFO_CLASS: ActivityClass = { kind: 'info', tag: 'INFO' };

export { ACTIVITY_RULES, ERROR_CLASS, INFO_CLASS, ROOM_TAG, WARN_CLASS };
