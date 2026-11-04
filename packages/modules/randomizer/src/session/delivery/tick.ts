/* @layer core @kind logic */
import type { TickContext } from './tick-context.type';
import { tickFrontEntry } from './tick-front-entry';
import { tickInFlight } from './tick-in-flight';

const tick = <A>(ctx: TickContext<A>): void => {
  const { state } = ctx;
  if (state.cooldownFrames > 0) {
    state.cooldownFrames--;
    return;
  }
  if (state.delivering) {
    tickInFlight(ctx, state.delivering);
    return;
  }
  tickFrontEntry(ctx);
};

export { tick };
