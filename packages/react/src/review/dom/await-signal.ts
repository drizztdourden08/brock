/* @layer renderer-shell @kind logic */
import { HEARTBEAT_MS, WAIT_CEILING_MS } from '../review.constants';
import { reportCeiling } from './report-ceiling';
import { reviewAlive } from './review-alive';
import type { AwaitOptions, Found } from './wake.type';

const awaitSignal = <T>(probe: () => Found<T> | Promise<Found<T>>, { what, ceilingMs = WAIT_CEILING_MS, wakeOn = [], report = true }: AwaitOptions): Promise<T | null> =>
  new Promise<T | null>((resolve, reject) => {
    let finished = false;
    const state = { probing: false, again: false };
    const stirred = (): boolean => state.again;
    const over = (): boolean => finished;
    const stops: (() => void)[] = [];

    const finish = (value: T | null): void => {
      if (finished) return;
      finished = true;
      clearTimeout(ceiling);
      clearInterval(heartbeat);
      for (const stop of stops) stop();
      resolve(value);
    };
    const fail = (err: unknown): void => {
      if (finished) return;
      finished = true;
      clearTimeout(ceiling);
      clearInterval(heartbeat);
      for (const stop of stops) stop();
      reject(err instanceof Error ? err : new Error(String(err)));
    };
    const check = async (): Promise<void> => {
      if (finished) return;
      if (state.probing) {
        state.again = true;
        return;
      }
      state.probing = true;
      try {
        do {
          state.again = false;
          const value = await probe();
          if (value) {
            finish(value);
            return;
          }
        } while (stirred() && !over());
      } catch (err) {
        fail(err);
      } finally {
        state.probing = false;
      }
    };
    const wake = (): void => {
      if (finished) return;
      reviewAlive();
      void check();
    };

    const ceiling = setTimeout(() => {
      if (report && ceilingMs >= WAIT_CEILING_MS) reportCeiling(what, ceilingMs);
      finish(null);
    }, ceilingMs);
    const heartbeat = setInterval(wake, HEARTBEAT_MS);
    for (const source of wakeOn) stops.push(source(wake));
    reviewAlive(true);
    void check();
  });

export { awaitSignal };
