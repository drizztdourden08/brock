/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const onPath = () => {
  try {
    execFileSync('7z', ['i'], { stdio: 'ignore' });
    return '7z';
  } catch {
    return undefined;
  }
};

const installed = () => {
  const roots = [process.env.ProgramFiles, process.env.ProgramW6432, process.env['ProgramFiles(x86)'], 'C:\\Program Files', 'C:\\Program Files (x86)'];
  return roots.filter(Boolean).map((root) => join(root, '7-Zip', '7z.exe')).find((exe) => existsSync(exe));
};

/**
 * @returns {string | undefined} the 7z command, PATH first
 */
const findSevenZip = () => onPath() ?? installed();

export { findSevenZip };
