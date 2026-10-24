/* @layer electron-main @kind logic */
import { homedir } from 'os';
import { join } from 'path';
import type { SensitiveRoots } from './folder-grants.type';
import { POSIX_SYSTEM_FOLDERS } from './sensitive-folders.constants';

const sensitiveFolders = (): SensitiveRoots => {
  const home = homedir();
  const { env } = process;
  const named = [env.APPDATA, env.LOCALAPPDATA, env.ProgramFiles, env['ProgramFiles(x86)'], env.ProgramW6432, env.ProgramData, env.SystemRoot, env.windir];
  const inHome = ['AppData', 'Library', '.config', '.local', '.cache'].map((name) => join(home, name));
  const system = process.platform === 'win32' ? [] : POSIX_SYSTEM_FOLDERS;
  return { home: [home], trees: [...inHome, ...named, ...system].filter((folder): folder is string => typeof folder === 'string' && folder !== '') };
};

export { sensitiveFolders };
