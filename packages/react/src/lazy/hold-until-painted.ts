/* @layer renderer-shell @kind logic */
import { waitFrames } from '../boot/wait-frames';
import { holdScreenshot } from '../screenshot/hold-screenshot';
import { PAINT_FRAMES } from './lazy.constants';

const painted = (): Promise<void> => (typeof requestAnimationFrame === 'function' ? waitFrames(PAINT_FRAMES) : Promise.resolve());

const holdUntilPainted = (load: Promise<unknown>): void => {
  const release = holdScreenshot();
  const done = (): void => { void painted().then(release, release); };
  load.then(done, done);
};

export { holdUntilPainted };
