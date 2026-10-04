/* @layer electron-main @kind logic */
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import type { EntryFacts } from './widget-windows.type';

const entryFacts = (popped: WidgetWindowOpen = {}): EntryFacts => {
  const snap = popped.snap ?? true;
  const sync = popped.sync ?? true;
  const wantsTaskbar = popped.taskbar === true;
  return {
    pin: popped.pin ?? 'off', snap, link: snap ? popped.link ?? null : null, seq: popped.seq, sync, group: popped.group ?? null, wantsTaskbar, taskbar: wantsTaskbar || !sync,
  };
};

export { entryFacts };
