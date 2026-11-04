/* @layer core @kind logic */
import type { ConnectionState } from '../network/network-status.type';
import { LOG_PREFIX } from './connection-notices.constants';
import type { ConnectionUpdate } from './connection-notices.type';
import { noticeOf } from './notice-of';
import type { OnlineNotice } from './notice.type';
import { playerPart } from './player-part';

const connectedNotice = (slotName: string, everConnected: boolean): OnlineNotice =>
  everConnected
    ? noticeOf('connection', [{ text: 'Reconnected to the room' }])
    : noticeOf('connection', [{ text: 'Connected to the room as ' }, playerPart(slotName)]);

const reconnectingNotice = (lost: boolean): OnlineNotice =>
  lost
    ? noticeOf('connection', [{ text: 'Connection lost, reconnecting' }])
    : noticeOf('connection', [{ text: 'Could not reach the server, retrying' }]);

const endedNotice = (error: string | undefined): OnlineNotice =>
  noticeOf('connection', [{ text: error ? error.replace(LOG_PREFIX, '') : 'Connection ended' }]);

const noticeOfChange = (from: ConnectionState, update: ConnectionUpdate, everConnected: boolean): OnlineNotice | null => {
  const { state, error, slotName = '' } = update;
  switch (state) {
    case 'connected':
      return connectedNotice(slotName, everConnected);
    case 'reconnecting':
      return reconnectingNotice(from === 'connected' || everConnected);
    case 'refused':
    case 'closed':
      return endedNotice(error);
    case 'idle':
    case 'connecting':
      return null;
  }
};

const createConnectionNotices = (emit: (notice: OnlineNotice) => void): ((update: ConnectionUpdate) => void) => {
  let last: ConnectionState = 'idle';
  let everConnected = false;
  return (update) => {
    const { state } = update;
    if (state === last) return;
    const notice = noticeOfChange(last, update, everConnected);
    last = state;
    const sessionBoundary = state === 'connected' || state === 'idle';
    if (sessionBoundary) everConnected = state === 'connected';
    if (notice !== null) emit(notice);
  };
};

export { createConnectionNotices };
