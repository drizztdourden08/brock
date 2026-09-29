/* @layer renderer-shell @kind logic */
import { SETTLE_MS } from '../review.constants';
import { delay } from './delay';

const nextFrame = (): Promise<void> => new Promise((resolve) => { requestAnimationFrame(() => resolve()); });

const settle = async (): Promise<void> => {
  await nextFrame();
  await delay(SETTLE_MS);
  await nextFrame();
};

export { settle };
