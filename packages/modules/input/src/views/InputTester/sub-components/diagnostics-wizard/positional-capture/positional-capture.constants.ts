/* @layer renderer-shell @kind constants */
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { CallMode, CellState, RecordOutcome } from './positional-capture.type';

const AXIS_FIRED_THRESHOLD = 0.5;
const AXIS_TRAVEL_THRESHOLD = 0.8;
const REST_EPSILON = 0.25;
const CELL_STATE_WORDS = {
  done: 'answered',
  skipped: 'skipped',
  current: 'waiting for you, use the controller now',
  pending: 'not asked yet',
} as const;
const CELL_MARKS: Readonly<Record<CellState, IconName>> = {
  done: 'check',
  skipped: 'circle-x',
  current: 'circle-dot',
  pending: 'circle',
};
const CALL_ICONS: Readonly<Record<CallMode, IconName>> = { act: 'gamepad-2', done: 'circle-check', idle: 'pause' };
const CALL_EYEBROWS: Readonly<Record<CallMode, string>> = {
  act: 'Use the controller now',
  done: 'Done',
  idle: 'Waiting for you',
};
const OUTCOME_ICONS: Readonly<Record<RecordOutcome['kind'], IconName>> = {
  match: 'circle-check',
  mismatch: 'triangle-alert',
  skipped: 'circle-x',
};
const TRIGGER_ID_PATTERN = /trigger|zl|zr|lt|rt|l2|r2/i;

export { AXIS_FIRED_THRESHOLD, CALL_EYEBROWS, CALL_ICONS, CELL_MARKS, CELL_STATE_WORDS, OUTCOME_ICONS, AXIS_TRAVEL_THRESHOLD, REST_EPSILON, TRIGGER_ID_PATTERN };
