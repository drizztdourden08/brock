/* @layer electron-main @kind logic */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { app } from 'electron';
import { ADDON_FILE, INPUT_PACKAGE, PREBUILDS_DIR } from './sdl3.constants';

const modulePrebuildCandidates = (platformArch: string): string[] => {
  try {
    const packageFile = createRequire(join(app.getAppPath(), 'package.json')).resolve(`${INPUT_PACKAGE}/package.json`);
    return [join(dirname(packageFile), PREBUILDS_DIR, platformArch, ADDON_FILE)];
  } catch {
    return [];
  }
};

export { modulePrebuildCandidates };
