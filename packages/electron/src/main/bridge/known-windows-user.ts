/* @layer electron-main @kind logic */
import type { WindowsUser } from './bridge.type';

const knownWindowsUser: { user: WindowsUser | null } = { user: null };

export { knownWindowsUser };
