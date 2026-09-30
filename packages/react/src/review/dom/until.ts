/* @layer renderer-shell @kind logic */
import { POLL_MS, POP_OUT_WAIT_MS } from '../review.constants';
import { delay } from './delay';

const until = async (probe: () => Promise<boolean>, timeoutMs = POP_OUT_WAIT_MS): Promise<boolean> => {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    if (await probe()) return true;
    await delay(POLL_MS);
  }
  return false;
};

export { until };
