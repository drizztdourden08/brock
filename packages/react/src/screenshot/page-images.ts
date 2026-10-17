/* @layer renderer-shell @kind logic */
import { nextFrames } from './next-frames';
import { IMAGE_WAIT_MS } from './screenshot.constants';

const givenUp = new WeakSet<HTMLImageElement>();

const unsettled = (): HTMLImageElement[] => (typeof document === 'undefined'
  ? []
  : Array.from(document.querySelectorAll('img')).filter((img) => !img.complete && img.loading !== 'lazy' && !givenUp.has(img)));

const loaded = (img: HTMLImageElement): Promise<boolean> => new Promise((resolve) => {
  const listeners = new AbortController();
  const done = (ok: boolean): void => {
    clearTimeout(timer);
    listeners.abort();
    resolve(ok);
  };
  const timer = setTimeout(() => done(false), IMAGE_WAIT_MS);
  img.addEventListener('load', () => done(true), { signal: listeners.signal });
  img.addEventListener('error', () => done(true), { signal: listeners.signal });
  if (img.complete) done(true);
});

const finite = (animation: Animation): boolean => Number.isFinite(animation.effect?.getComputedTiming().endTime ?? Infinity);

const shownIn = async (img: HTMLImageElement): Promise<void> => {
  await nextFrames();
  const running = typeof img.getAnimations === 'function' ? img.getAnimations().filter(finite) : [];
  await Promise.all(running.map((animation) => animation.finished.catch(() => undefined)));
};

const settleImage = async (img: HTMLImageElement): Promise<void> => {
  if (await loaded(img)) {
    await shownIn(img);
    return;
  }
  givenUp.add(img);
};

const settled = async (images: readonly HTMLImageElement[] = unsettled()): Promise<void> => {
  await Promise.all(images.map(settleImage));
};

const pageImages = { unsettled, settled };

export { pageImages };
