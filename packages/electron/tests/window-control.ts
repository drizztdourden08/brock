/* @layer electron-main @kind test */
import type { BrowserWindow } from 'electron';
import type { MainWindowControl } from '../src/main/window/main-window-control.type';

const windowOf = (find: () => BrowserWindow | null): MainWindowControl =>
  Object.assign(find, { show: (): Promise<void> => Promise.resolve() });

export { windowOf };
