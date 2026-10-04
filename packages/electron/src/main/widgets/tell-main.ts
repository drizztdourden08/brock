/* @layer electron-main @kind logic */
import type { PoppedWidgetPatch } from '@drizztdourden08/brock-core';
import { emit } from '../ipc/emit';
import { getMainWindow } from '../window/get-main-window';

const tellMain = (id: string, patch: PoppedWidgetPatch): void => {
  const main = getMainWindow();
  if (main) emit(main, 'widget:popped', id, patch);
};

export { tellMain };
