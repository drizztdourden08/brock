/* @layer electron-main @kind logic */
import type { WidgetSlice } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { liveEntries } from './live-entries';

const relayToWidgetWindows = (slice: WidgetSlice): void => {
  for (const [, entry] of liveEntries()) emit(entry.win, 'widget:relay', slice);
};

export { relayToWidgetWindows };
