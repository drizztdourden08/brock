/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';

const mainWindowRef: { current: BrowserWindow | null } = { current: null };

export { mainWindowRef };
