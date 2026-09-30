/* @layer renderer-shell @kind logic */
import type { PoppedWidget } from '@drizztdourden08/tessera/composites';
import { hostApi } from '../host/host-api';

const opened = new Set<string>();

const open = ({ id, ...facts }: PoppedWidget): void => {
  if (opened.has(id)) return;
  opened.add(id);
  void hostApi()?.popOutWidget(id, facts);
};

const sync = (popped: readonly PoppedWidget[]): void => {
  const wanted = new Set(popped.map((p) => p.id));
  for (const id of [...opened]) {
    if (wanted.has(id)) continue;
    opened.delete(id);
    hostApi()?.dockBackWidget(id, 'close');
  }
  for (const entry of popped) open(entry);
};

const poppedWindows = { open, sync, forget: (id: string): void => { opened.delete(id); } };

export { poppedWindows };
