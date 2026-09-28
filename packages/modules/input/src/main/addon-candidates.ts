/* @layer electron-main @kind logic */
import { join } from 'node:path';
import { app } from 'electron';
import { ADDON_DIR, ADDON_FILE } from './sdl3.constants';

const addonCandidates = (configured: string | undefined): string[] => {
  const platformArch = `${process.platform}-${process.arch}`;
  const packaged = process.resourcesPath ? [join(process.resourcesPath, ADDON_DIR, platformArch, ADDON_FILE)] : [];
  return [
    ...(configured ? [configured] : []),
    ...packaged,
    join(app.getAppPath(), ADDON_DIR, platformArch, ADDON_FILE),
  ];
};

export { addonCandidates };
