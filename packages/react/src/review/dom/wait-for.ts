/* @layer renderer-shell @kind logic */
import { POLL_MS, WAIT_MS } from '../review.constants';
import { delay } from './delay';

const waitFor = async <T>(probe: () => T | null | undefined | false, timeoutMs = WAIT_MS): Promise<T | null> => {
  const deadline = performance.now() + timeoutMs;
  let value = probe();
  while (!value && performance.now() < deadline) {
    await delay(POLL_MS);
    value = probe();
  }
  if (!value) return null;
  return value;
};

export { waitFor };
