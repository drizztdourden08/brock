/* @layer renderer-shell @kind logic */
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { RoomMessage } from '../../../archipelago';
import type { LogRule } from '../../../contract/randomizer-views.type';
import { formatTime } from '../dashboard/format-time';
import { ROOM_TAG } from './activity-rules.constants';
import { logRowOf } from './log-row-of';
import type { TimedRow } from './merge-room-rows.type';

const roomRowOf = (message: RoomMessage): TimedRow => ({
  at: message.at,
  row: { id: `room-${message.id}`, gutter: formatTime(message.at), tag: ROOM_TAG, kind: message.kind, message: message.text },
});

const mergeRoomRows = (entries: readonly LogEntry[], messages: readonly RoomMessage[], rules: readonly LogRule[]): LogRow[] => {
  const timed = [
    ...entries.map((entry): TimedRow => ({ at: entry.timestamp, row: logRowOf(entry, rules) })),
    ...messages.map(roomRowOf),
  ];
  return timed.sort((a, b) => a.at - b.at).map((item) => item.row);
};

export { mergeRoomRows };
