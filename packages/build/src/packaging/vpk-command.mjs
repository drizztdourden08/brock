/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * @returns {string} ~/.dotnet/tools/vpk when present, else vpk on PATH
 */
const vpkCommand = () => {
  const local = join(homedir(), '.dotnet', 'tools', process.platform === 'win32' ? 'vpk.exe' : 'vpk');
  return existsSync(local) ? local : 'vpk';
};

export { vpkCommand };
