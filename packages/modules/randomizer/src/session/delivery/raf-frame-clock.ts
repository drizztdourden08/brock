/* @layer core @kind logic */
import type { FrameClock } from './frame-clock.type';

const createRafFrameClock = (): FrameClock => ({
  onFrame: (cb) => {
    let id = 0;
    const loop = (): void => {
      id = requestAnimationFrame(loop);
      cb();
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  },
});

export { createRafFrameClock };
