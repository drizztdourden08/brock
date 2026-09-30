/* @layer electron-main @kind logic */
import { app } from 'electron';
import { rm } from 'fs/promises';
import { basename } from 'path';
import { DEFAULT_REVIEW_NAME, REVIEW_FLAG } from '@drizztdourden08/brock-core/review';
import { assertSafeName } from '@drizztdourden08/brock-core/storage';
import type { MainContext } from '../types/main-context.type';
import { writeCapture } from '../handlers/write-capture';
import { tapMainConsole } from '../logs/tap-main-console';
import { bootEvents } from '../boot/boot-events';
import { bootState } from '../boot/boot-state';
import { whenRevealed } from '../boot/when-revealed';
import { createReviewSession } from '../review/create-review-session';
import { finishReview } from '../review/finish-review';
import { REVIEW_WATCHDOG_MS } from '../review/review.constants';
import { watchReviewWindow } from '../review/watch-review-window';

const armReviewFlag = (ctx: MainContext, windowIcon: string | undefined): void => {
  if (!ctx.flags.hasFlag(REVIEW_FLAG)) return;
  const name = assertSafeName(ctx.flags.flagValue(REVIEW_FLAG) ?? DEFAULT_REVIEW_NAME, 'review name');
  const session = createReviewSession({
    name,
    app: { name: ctx.product.window.title ?? ctx.product.name, version: app.getVersion(), electron: process.versions.electron },
    windowIcon: windowIcon ? basename(windowIcon) : null,
  });
  const cleared = rm(session.dir, { recursive: true, force: true }).catch(() => undefined);
  const untap = tapMainConsole(session.addMainLine);
  bootEvents.once('window', (win) => watchReviewWindow(win, session));

  let done = false;
  const finish = (finished: boolean): void => {
    if (done) return;
    done = true;
    untap();
    session.setBoot({ ...bootState.timeline });
    void finishReview(session, finished);
  };

  ctx.handle('review:capture', async (_event, step) => {
    await Promise.all([cleared, whenRevealed()]);
    const { timeline } = bootState;
    timeline.splashOpenAtCapture ??= bootState.splash !== null && !bootState.splash.isDestroyed();
    const target = ctx.window();
    const record = session.nextStep(step);
    if (!target) throw new Error('no window to capture');
    await writeCapture(target, session.dir, record.file);
    return record.file;
  });
  ctx.on('review:check', (_event, check) => session.addCheck(check));
  ctx.on('review:finish', () => finish(true));
  bootEvents.once('failed', () => finish(false));
  setTimeout(() => finish(false), REVIEW_WATCHDOG_MS).unref();
  ctx.log(`review "${name}" armed; the report goes to ${session.dir}`);
};

export { armReviewFlag };
