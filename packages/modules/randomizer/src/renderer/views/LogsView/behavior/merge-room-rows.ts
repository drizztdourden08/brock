/* @layer renderer-shell @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { LogRow } from '@drizztdourden08/tessera/composites';
import type { LogEntry } from '@drizztdourden08/brock-core';
import type { RoomMessage } from '../../../../archipelago';
import { logRowOf } from './log-row-of';
import { ROOM_TAG } from '../LogsView.constants';

interface TimedRow {
  at: number;
  row: LogRow;
}

const roomRowOf = (message: RoomMessage): TimedRow => ({
  at: message.at,
  row: {
    id: `room-${message.id}`,
    gutter: formatDate(message.at, 'time', { length: 'medium' }),
    tag: ROOM_TAG,
    kind: message.kind,
    message: message.text,
  },
});

const mergeRoomRows = (entries: readonly LogEntry[], messages: readonly RoomMessage[]): LogRow[] => {
  const timed = [
    ...entries.map((entry): TimedRow => ({ at: entry.timestamp, row: logRowOf(entry) })),
    ...messages.map(roomRowOf),
  ];
  return timed.sort((a, b) => a.at - b.at).map((item) => item.row);
};

export { mergeRoomRows };
