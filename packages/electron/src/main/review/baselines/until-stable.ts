/* @layer electron-main @kind logic */
import { STABLE_TRIES } from './review-baselines.constants';

const nextTurn = (): Promise<void> => new Promise((resolve) => { setImmediate(resolve); });

const untilStable = async (take: () => Promise<Buffer | null>, between: () => Promise<void> = nextTurn): Promise<{ png: Buffer | null; stable: boolean }> => {
  let last = await take();
  for (let tries = 1; tries < STABLE_TRIES && last; tries += 1) {
    await between();
    const next = await take();
    if (next?.equals(last)) return { png: next, stable: true };
    last = next;
  }
  return { png: last, stable: false };
};

export { untilStable };
