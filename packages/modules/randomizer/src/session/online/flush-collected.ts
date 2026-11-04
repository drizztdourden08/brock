/* @layer core @kind logic */
import { checkSignal } from '../signal/check-signal';
import type { OnlineParts } from './online-parts.type';

const flushCollected = <P, A>({ ap, game, run, poller }: OnlineParts<P, A>): void => {
  if (run.armed === null || run.collected.size === 0) return;
  const keys: string[] = [];
  for (const id of run.collected) {
    const key = run.keysById.get(id);
    if (key !== undefined) keys.push(key);
  }
  run.collected.clear();
  for (const key of keys) poller.suppress(key);
  ap.markCollected?.(keys);
  checkSignal.notify(game.memory.view());
};

export { flushCollected };
