/* @layer electron-main @kind logic */
import { isAbsolute, posix, win32 } from 'path';
import { PROCESS_INTERPRETERS, PROCESS_WINDOWS_DRIVE, PROCESS_WINDOWS_PREFIX, PROCESS_WINDOWS_PROGRAM } from './process-job.constants';
import type { ProcessAllow } from './process-job.type';

const checkWindowsPath = (command: string, allow: ProcessAllow): string | null => {
  const path = win32.normalize(command);
  const special = path.startsWith('\\');
  if (special && !allow.network) return 'The command must be a drive letter path, not a network, device or root-relative path.';
  if (!special && !PROCESS_WINDOWS_DRIVE.test(path)) return 'The command must be an absolute path with a drive letter.';
  if (path.replace(PROCESS_WINDOWS_PREFIX, '').includes(':')) return 'The command may not name an alternate data stream.';
  if (!PROCESS_WINDOWS_PROGRAM.test(path)) return 'The command must be an .exe or .com program.';
  return null;
};

const baseName = (command: string, platform: NodeJS.Platform): string => {
  const name = (platform === 'win32' ? win32 : posix).basename(command).toLowerCase();
  return name.replace(/\.(exe|com)$/, '');
};

const checkCommand = (command: unknown, allow: ProcessAllow, platform: NodeJS.Platform): string | null => {
  if (typeof command !== 'string' || command === '' || command.includes('\0')) return 'The command must be an absolute path.';
  if (platform === 'win32') {
    const problem = checkWindowsPath(command, allow);
    if (problem) return problem;
  } else if (!isAbsolute(command)) {
    return 'The command must be an absolute path.';
  }
  if (!allow.interpreters && PROCESS_INTERPRETERS.includes(baseName(command, platform))) {
    return 'This program parses its own command line; the definition must allow interpreters to run it.';
  }
  return null;
};

export { checkCommand };
