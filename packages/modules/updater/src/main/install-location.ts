/* @layer electron-main @kind logic */
import { posix, win32 } from 'path';
import type { InstallFacts, InstallLocation } from './updater-main.type';
import { MAC_BUNDLE_SUFFIX, UNINSTALL_KEY_ROOT, VELOPACK_CURRENT_DIR, VELOPACK_UPDATE_EXE } from './updater-main.constants';

const windowsRoot = ({ execPath, appId, exists }: InstallFacts): InstallLocation | null => {
  const current = win32.dirname(execPath);
  const root = win32.dirname(current);
  if (win32.basename(current) !== VELOPACK_CURRENT_DIR || !exists(win32.join(root, VELOPACK_UPDATE_EXE))) return null;
  return { path: root, uninstallKey: `${UNINSTALL_KEY_ROOT}\\${appId}` };
};

const macBundle = (execPath: string): InstallLocation | null => {
  for (let dir = posix.dirname(execPath); dir !== posix.dirname(dir); dir = posix.dirname(dir)) {
    if (dir.endsWith(MAC_BUNDLE_SUFFIX)) return { path: dir, uninstallKey: null };
  }
  return null;
};

const installLocation = (facts: InstallFacts): InstallLocation | null => {
  if (facts.platform === 'win32') return windowsRoot(facts);
  if (facts.platform === 'darwin') return macBundle(facts.execPath);
  if (facts.platform === 'linux' && facts.appImage) return { path: facts.appImage, uninstallKey: null };
  return null;
};

export { installLocation };
