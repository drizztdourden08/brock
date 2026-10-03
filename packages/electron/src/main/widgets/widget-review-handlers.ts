/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { ReviewSession } from '../review/review-session.type';
import { writeCapture } from '../handlers/write-capture';
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
    await writeCapture(target, session.dir, record.file);
    return record.file;
  });
};

export { widgetReviewHandlers };
