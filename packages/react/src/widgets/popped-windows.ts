/* @layer renderer-shell @kind logic */
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import type { PoppedWidget } from '@drizztdourden08/tessera/composites';
import { hostApi } from '../host/host-api';

const opened = new Map<string, number>();
let counter = 0;

const open = ({ id, ...facts }: PoppedWidget, extra: Partial<WidgetWindowOpen> = {}): void => {
  if (opened.has(id)) return;
  counter += 1;
  opened.set(id, counter);
  void hostApi()?.popOutWidget(id, { ...facts, ...extra, seq: counter });
};

const close = (id: string): void => {
  if (!opened.delete(id)) return;
  hostApi()?.dockBackWidget(id, 'close');
};

const sync = (shown: readonly PoppedWidget[], extraOf: (id: string) => Partial<WidgetWindowOpen>): void => {
  const wanted = new Set(shown.map((p) => p.id));
  for (const id of [...opened.keys()]) if (!wanted.has(id)) close(id);
  for (const entry of shown) open(entry, extraOf(entry.id));
};

const settle = (id: string, seq: number | undefined): boolean => {
  const current = opened.get(id);
  if (current === undefined || (seq !== undefined && seq !== current)) return false;
  opened.delete(id);
  return true;
};

const poppedWindows = { open, sync, settle, isOpen: (id: string): boolean => opened.has(id) };

export { poppedWindows };
