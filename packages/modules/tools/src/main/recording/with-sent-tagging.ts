/* @layer electron-main @kind logic */
import type { MainBugReportTransport } from '@drizztdourden08/brock-electron/main';
import { markRecordingsSent } from './mark-recordings-sent';
import { selectRecordings } from './select-recordings';
import type { SentTaggingOptions } from './recording-main.type';

const withSentTagging = (transport: MainBugReportTransport, options: SentTaggingOptions = {}): MainBugReportTransport => {
  const { select = selectRecordings, now = Date.now } = options;
  return async (payload, ctx) => {
    const result = await transport(payload, ctx);
    const ref = result.success ? select(payload) : null;
    if (ref) await markRecordingsSent(ctx, ref, now()).catch(() => undefined);
    return result;
  };
};

export { withSentTagging };
