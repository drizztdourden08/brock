/* @layer electron-main @kind logic */
import { liveEntries } from './live-entries';

const flushWidgetBounds = (): boolean => {
  let flushed = false;
  for (const [, entry] of liveEntries()) flushed = entry.report.flush() || flushed;
  return flushed;
};

export { flushWidgetBounds };
