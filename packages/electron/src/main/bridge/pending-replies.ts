/* @layer electron-main @kind logic */
import type { BridgeRequestId, PendingReplies, PendingWaiter } from './bridge.type';

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
        reject(new Error(`bridge request "${channel}" timed out after ${timeoutMs} ms`));
      }, timeoutMs);
      waiting.set(id, { resolve, reject, timer });
    }),
    settle: (reply) => {
      const waiter = reply.id === null ? undefined : take(reply.id);
      if (!waiter) return;
      if (reply.ok) waiter.resolve(reply.value);
      else waiter.reject(new Error(reply.error));
    },
    failAll: (error) => {
      for (const id of [...waiting.keys()]) take(id)?.reject(error);
    },
  };
};

export { createPendingReplies };
