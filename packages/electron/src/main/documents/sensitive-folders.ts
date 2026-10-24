/* @layer electron-main @kind logic */
import { homedir } from 'os';
import { join } from 'path';

const sensitiveFolders = (): string[] => {
  const home = homedir();
  return [home, join(home, 'AppData'), join(home, 'Library'), join(home, '.config')];
};

export { sensitiveFolders };
