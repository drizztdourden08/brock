/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { RoomMessage } from '../../../archipelago';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { mergeRoomRows } from './merge-room-rows';
import { GOAL_LINE, KEPT_ALWAYS, KEPT_INFO, KEPT_KINDS, RECENT_LIMIT } from './recent-activity.constants';

const isKeptMessage = (message: RoomMessage): boolean =>
  KEPT_ALWAYS.has(message.kind) || (message.kind === 'server' && GOAL_LINE.test(message.text));

const isKeptRow = (row: LogRow): boolean =>
  KEPT_KINDS.has(row.kind) || (row.kind === 'info' && KEPT_INFO.test(row.message));

const recentActivityOf = (entries: readonly LogEntry[], messages: readonly RoomMessage[], rules: readonly LogRule[]): LogRow[] =>
  mergeRoomRows(entries, messages.filter(isKeptMessage), rules).filter(isKeptRow).slice(-RECENT_LIMIT).reverse();

export { recentActivityOf };
