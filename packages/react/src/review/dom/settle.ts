/* @layer renderer-shell @kind logic */
import { REVIEW_IDLE_MS } from '../../lazy/lazy.constants';
import { lazyLoads } from '../../lazy/lazy-loads';
import { pageImages } from '../../screenshot/page-images';
import { quietLayout } from './quiet-layout';
import { reviewAlive } from './review-alive';

const nextFrame = (): Promise<void> => new Promise((resolve) => { requestAnimationFrame(() => resolve()); });

const settle = async (): Promise<void> => {
  reviewAlive();
  await nextFrame();
  await lazyLoads.idle(REVIEW_IDLE_MS);
  await pageImages.settled();
  await quietLayout();
};

export { settle };
