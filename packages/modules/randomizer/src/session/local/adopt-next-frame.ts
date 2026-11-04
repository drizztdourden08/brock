/* @layer core @kind logic */
import type { FrameClock } from '../delivery/frame-clock.type';
import type { LocationPoller } from '../poller/location-poller.type';

const adoptNextFrame = (clock: FrameClock, poller: LocationPoller): (() => void) => {
  let off: (() => void) | null = null;
  let done = false;
  off = clock.onFrame(() => {
    if (done) return;
    done = true;
    off?.();
    poller.pollOnce();
  });
  return () => {
    done = true;
    off?.();
  };
};

export { adoptNextFrame };
