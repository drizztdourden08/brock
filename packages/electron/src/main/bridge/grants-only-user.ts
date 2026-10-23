/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const aclEntries = (output: string, file: string): string[] => {
  const [first = '', ...rest] = (output.split(/\r?\n\s*\r?\n/)[0] ?? '').split(/\r?\n/);
  if (!first.toLowerCase().startsWith(file.toLowerCase())) return [];
  return [first.slice(file.length), ...rest].map((entry) => entry.trim()).filter(Boolean);
};

const grantsOnlyUser = (file: string, run: SystemToolRun = runSystemTool): boolean => {
  const full = resolve(file);
  try {
    const entries = aclEntries(run('icacls.exe', [full]), full);
    return entries.length === 1 && entries[0]?.toLowerCase() === `${windowsUser(run).name}:(F)`.toLowerCase();
  } catch {
    return false;
  }
};

export { grantsOnlyUser };
