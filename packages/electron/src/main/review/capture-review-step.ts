/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { baselineKeys, resolveBaselineRule } from '@drizztdourden08/brock-core/review';
import type { ReviewStepRecord } from '@drizztdourden08/brock-core/review';
import { writeCapture } from '../handlers/write-capture';
import { prepareCapture } from './baselines/prepare-capture';
import { untilStable } from './baselines/until-stable';
import type { ReviewSession } from './review-session.type';

const captureReviewStep = async (session: ReviewSession, win: BrowserWindow, record: ReviewStepRecord): Promise<string> => {
  if (!session.baselines) return writeCapture(win, session.dir, record.file);
  const key = baselineKeys(session.run().steps).get(record.file) ?? record.file;
  const { selectors } = resolveBaselineRule(session.baselines.config, key);
  session.addMasks(record.file, await prepareCapture(win.webContents, selectors));
  const { png, stable } = await untilStable(async () => (await win.webContents.capturePage()).toPNG());
  if (!stable) session.markUnsettled(record.file);
  const outPath = join(session.dir, record.file);
  await mkdir(session.dir, { recursive: true });
  await writeFile(outPath, png ?? Buffer.alloc(0));
  return outPath;
};

export { captureReviewStep };
