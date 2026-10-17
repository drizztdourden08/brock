/* @layer renderer-shell @kind logic */
import { hostApi } from '../host/host-api';
import { nextFrames } from './next-frames';
import { pageImages } from './page-images';

const state = { count: 0, check: 0 };

const report = (count: number): void => {
  hostApi()?.captureHolds(count);
};

const take = (onEmpty: () => void): (() => void) => {
  state.count += 1;
  state.check += 1;
  report(state.count);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    state.count -= 1;
    if (state.count > 0) report(state.count);
    else onEmpty();
  };
};

const reportWhenStable = async (): Promise<void> => {
  state.check += 1;
  const check = state.check;
  await nextFrames();
  if (check !== state.check) return;
  const images = pageImages.unsettled();
  if (images.length === 0) {
    report(0);
    return;
  }
  const release = take(() => { void reportWhenStable(); });
  await pageImages.settled(images);
  release();
};

const holdScreenshot = (): (() => void) => take(() => { void reportWhenStable(); });

export { holdScreenshot };
