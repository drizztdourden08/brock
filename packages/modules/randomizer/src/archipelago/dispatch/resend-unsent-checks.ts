/* @layer core @kind logic */
import type { OnlineContext } from '../client/online-context.type';

const resendUnsentChecks = (ctx: OnlineContext): void => {
  const { room } = ctx;
  const unsent = [...room.reportedLocal].filter((id) => !room.checked.has(id));
  if (unsent.length > 0) ctx.send({ cmd: 'LocationChecks', locations: unsent });
};

export { resendUnsentChecks };
