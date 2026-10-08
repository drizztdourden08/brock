/* @layer electron-main @kind logic */
import { PREPARE_TIMEOUT_MS } from './review-baselines.constants';

const withinTime = <T>(work: Promise<T>): Promise<T | null> => Promise.race([
  work.catch(() => null),
  new Promise<null>((resolve) => { setTimeout(() => resolve(null), PREPARE_TIMEOUT_MS).unref(); }),
]);

export { withinTime };
