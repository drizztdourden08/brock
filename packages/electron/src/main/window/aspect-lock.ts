/* @layer electron-main @kind logic */
import { NO_ASPECT_LOCK } from './aspect-lock.constants';
import type { AspectLock } from './aspect-lock.type';

let current: AspectLock = NO_ASPECT_LOCK;

const aspectLock = {
  get: (): AspectLock => current,
  set: (next: AspectLock): void => {
    current = next;
  },
};

export { aspectLock };
