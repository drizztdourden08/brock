/* @layer electron-main @kind logic */
import { STABLE_GAP_MS, STABLE_TRIES } from './review-baselines.constants';

const pause = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

const untilStable = async (take: () => Promise<Buffer | null>): Promise<{ png: Buffer | null; stable: boolean }> => {
  let last = await take();
  for (let tries = 1; tries < STABLE_TRIES && last; tries += 1) {
    await pause(STABLE_GAP_MS);
    const next = await take();
    if (next?.equals(last)) return { png: next, stable: true };
    last = next;
  }
  return { png: last, stable: false };
};

export { untilStable };
