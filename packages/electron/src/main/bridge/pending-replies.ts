/* @layer electron-main @kind logic */
import type { PendingReplies, PendingWaiter } from './bridge-client.type';
import type { BridgeRequestId } from './bridge.type';
import { BRIDGE_CODES } from './bridge.constants';
import { BridgeError } from './bridge-error';

const createPendingReplies = (): PendingReplies => {
  const waiting = new Map<BridgeRequestId, PendingWaiter>();
  const take = (id: BridgeRequestId): PendingWaiter | undefined => {
    const waiter = waiting.get(id);
    waiting.delete(id);
    if (waiter) clearTimeout(waiter.timer);
    return waiter;
  };
  return {
    wait: (id, channel, timeoutMs) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        take(id);
        reject(new BridgeError(`bridge request "${channel}" timed out after ${timeoutMs} ms`, { code: BRIDGE_CODES.timeout }));
      }, timeoutMs);
      waiting.set(id, { resolve, reject, timer });
    }),
    settle: (reply) => {
      const waiter = reply.id === null ? undefined : take(reply.id);
      if (!waiter) return;
      if (reply.ok) waiter.resolve(reply.value);
      else waiter.reject(new BridgeError(reply.error, { code: reply.code, data: reply.data }));
    },
    failAll: (error) => {
      for (const id of [...waiting.keys()]) take(id)?.reject(new BridgeError(error.message, { code: BRIDGE_CODES.closed }));
    },
  };
};

export { createPendingReplies };
