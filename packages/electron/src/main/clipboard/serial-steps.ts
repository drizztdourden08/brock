/* @layer electron-main @kind logic */
import type { SerialSteps } from './clipboard-watch.type';

const serialSteps = (): SerialSteps => {
  let queue: Promise<void> = Promise.resolve();
  let pending = 0;

  return {
    run: (step) => {
      pending += 1;
      queue = queue
        .then(step)
        .catch(() => undefined)
        .finally(() => {
          pending -= 1;
        });
    },
    busy: () => pending > 0,
  };
};

export { serialSteps };
