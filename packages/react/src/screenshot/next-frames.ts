/* @layer renderer-shell @kind logic */
import { waitFrames } from '../boot/wait-frames';
import { STABLE_FRAMES } from './screenshot.constants';

const nextFrames = (): Promise<void> => (typeof requestAnimationFrame === 'function' ? waitFrames(STABLE_FRAMES) : Promise.resolve());

export { nextFrames };
