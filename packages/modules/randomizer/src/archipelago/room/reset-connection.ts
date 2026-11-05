/* @layer core @kind logic */
import type { OnlineRoom } from './room.type';

const resetConnection = (room: OnlineRoom): void => {
  room.roomInfo = null;
  room.connected = false;
  room.heldReceived = [];
  room.syncPending = false;
  room.scoutIds = [];
  room.resyncWait?.();
  room.resyncWait = null;
};

export { resetConnection };
