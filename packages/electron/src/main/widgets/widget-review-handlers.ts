/* @layer electron-main @kind logic */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '../types/main-context.type';
import type { ReviewSession } from '../review/review-session.type';
import { captureReviewStep } from '../review/capture-review-step';
import { composeCapture } from './compose-capture';
import { sendReviewPref } from './send-review-pref';
import { widgetProbe } from './widget-probe';
import { widgetWindowControl } from './widget-window-control';

const widgetReviewHandlers = (ctx: MainContext, session: ReviewSession, stillWorking: () => void): void => {
  ctx.handle('review:setWidgetPref', (_event, id, key, value) => sendReviewPref(id, key, value));
  ctx.handle('review:widgetProbe', (_event, request) => {
    stillWorking();
    return widgetProbe(request);
  });
  ctx.handle('review:captureWidget', async (_event, id, step) => {
    stillWorking();
    const target = widgetWindowControl.windowOf(id);
    if (!target) return null;
    const record = session.nextStep(step);
    await captureReviewStep(session, target, record);
    return record.file;
  });
  ctx.handle('review:captureGroup', async (_event, step) => {
    stillWorking();
    const png = await composeCapture();
    if (!png) return null;
    const record = session.nextStep(step);
    await mkdir(session.dir, { recursive: true });
    await writeFile(join(session.dir, record.file), png);
    return record.file;
  });
};

export { widgetReviewHandlers };
