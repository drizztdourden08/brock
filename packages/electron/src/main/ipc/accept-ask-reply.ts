/* @layer electron-main @kind logic */
import { pendingAsks } from './ask-pending';
import { settleAsk } from './settle-ask';

const acceptAskReply = (senderId: number, id: unknown, outcome: unknown): void => {
  if (typeof id !== 'number' || pendingAsks.get(id)?.senderId !== senderId) return;
  if (typeof outcome !== 'object' || outcome === null) return;
  const { ok, value, message } = outcome as { ok?: unknown; value?: unknown; message?: unknown };
  settleAsk(id, ok === true ? { ok: true, value } : { ok: false, message: typeof message === 'string' ? message : 'the handler failed' });
};

export { acceptAskReply };
