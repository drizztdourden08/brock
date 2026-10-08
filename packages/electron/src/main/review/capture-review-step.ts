/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { baselineKeys, resolveBaselineRule } from '@drizztdourden08/brock-core/review';
import type { ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import { writeCapture } from '../handlers/write-capture';
import { readMaskRects } from './baselines/read-mask-rects';
import type { ReviewSession } from './review-session.type';

const captureReviewStep = async (session: ReviewSession, win: BrowserWindow, record: ReviewStepRecord): Promise<string> => {
  if (session.baselines) {
    const key = baselineKeys(session.run().steps).get(record.file) ?? record.file;
    const { selectors } = resolveBaselineRule(session.baselines.config, key);
    session.addMasks(record.file, await readMaskRects(win.webContents, selectors));
  }
  return writeCapture(win, session.dir, record.file);
};

export { captureReviewStep };
