/* @layer electron-main @kind logic */
import type { WindowSize } from '../window/startup-config.type';

const widgetRuntime: { headless: boolean; quitting: boolean; pinnedArea: WindowSize | null } = { headless: false, quitting: false, pinnedArea: null };

export { widgetRuntime };
