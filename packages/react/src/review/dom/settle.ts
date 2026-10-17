/* @layer renderer-shell @kind logic */
import { REVIEW_IDLE_MS } from '../../lazy/lazy.constants';
import { lazyLoads } from '../../lazy/lazy-loads';
import { pageImages } from '../../screenshot/page-images';
import { SETTLE_MS } from '../review.constants';
import { delay } from './delay';

const nextFrame = (): Promise<void> => new Promise((resolve) => { requestAnimationFrame(() => resolve()); });

const settle = async (): Promise<void> => {
  await nextFrame();
  await lazyLoads.idle(REVIEW_IDLE_MS);
  await pageImages.settled();
  await delay(SETTLE_MS);
  await nextFrame();
};

export { settle };
