/* @layer electron-main @kind logic */
import type { PoppedWidgetWire } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';

const tellMain = (id: string, patch: Partial<PoppedWidgetWire>): void => {
  const main = getMainWindow();
  if (main) emit(main, 'widget:popped', id, patch);
};

export { tellMain };
