/* @layer electron-main @kind logic */
import { writeCapture } from '../handlers/write-capture';
import { bootEvents } from '../boot/boot-events';
import { bootState } from '../boot/boot-state';
import { splashReady } from '../bootstrap/splash-ready';
import { REVIEW_SPLASH_STEP, SPLASH_SHOT_TIMEOUT_MS } from './review.constants';
import type { ReviewSession } from './review-session.type';

const timeout = (ms: number): Promise<never> => new Promise((_resolve, reject) => {
  setTimeout(() => reject(new Error(`the splash was not on screen within ${ms} ms`)), ms).unref();
});

const shoot = async (session: ReviewSession, step: string, cleared: Promise<unknown>): Promise<void> => {
  const when = step === REVIEW_SPLASH_STEP ? 'mid-boot' : 'on its error screen';
  try {
    const splash = await Promise.race([splashReady(), timeout(SPLASH_SHOT_TIMEOUT_MS)]);
    await cleared;
    const record = session.splashStep(step);
    await writeCapture(splash, session.dir, record.file);
    session.addCheck({ id: 'splash-captured', step, pass: true, reason: `the splash was captured ${when} as ${record.file}` });
  } catch (err) {
    session.addCheck({ id: 'splash-captured', step, pass: false, reason: `the splash was not captured: ${err instanceof Error ? err.message : String(err)}` });
  }
};

const captureReviewSplash = (session: ReviewSession, cleared: Promise<unknown>): () => Promise<void> => {
  let shot: Promise<void> | null = null;
  const take = (step: string): Promise<void> => {
    shot ??= shoot(session, step, cleared);
    return shot;
  };
  bootState.holds.push(new Promise<void>((resolve) => {
    bootEvents.once('progress', () => { void take(REVIEW_SPLASH_STEP).finally(resolve); });
  }));
  bootEvents.once('failed', () => { void take(`${REVIEW_SPLASH_STEP}-failed`); });
  return () => shot ?? Promise.resolve();
};

export { captureReviewSplash };
