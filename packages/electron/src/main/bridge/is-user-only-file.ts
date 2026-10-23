/* @layer electron-main @kind logic */
import { mkdtempSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { basename, dirname, join, resolve } from 'path';
import type { SystemToolRun, WindowsUser } from './bridge.type';
import { BRIDGE_OWNER_COLUMN, BRIDGE_PLAIN_FILE_NAME } from './bridge.constants';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const daclOf = (folder: string, name: string, run: SystemToolRun): string => {
  const scratch = mkdtempSync(join(tmpdir(), 'brock-acl-'));
  try {
    run('icacls.exe', [name, '/save', join(scratch, 'acl.txt')], folder);
    return readFileSync(join(scratch, 'acl.txt'), 'utf16le').split(/\r?\n/).find((line) => line.startsWith('D:')) ?? '';
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

const ownerLine = (folder: string, name: string, run: SystemToolRun): string => {
  const listing = run('cmd.exe', ['/u', '/d', '/c', 'dir', '/q', '/a', name], folder).toString('utf16le');
  return listing.split(/\r?\n/).find((line) => line.endsWith(` ${name}`))?.slice(0, -name.length).trimEnd().toLowerCase() ?? '';
};

const ownedBy = (line: string, user: WindowsUser): boolean => {
  const name = user.name.toLowerCase();
  const shown = [name.length, ...BRIDGE_OWNER_COLUMN.filter((width) => width < name.length)];
  return shown.some((width) => line.endsWith(` ${name.slice(0, width)}`));
};

const isUserOnlyFile = (file: string, run: SystemToolRun = runSystemTool): boolean => {
  const full = resolve(file);
  const [folder, name] = [dirname(full), basename(full)];
  if (!BRIDGE_PLAIN_FILE_NAME.test(name)) return false;
  try {
    const user = windowsUser(run);
    const dacl = daclOf(folder, name, run);
    const aces = [...dacl.matchAll(/\(([^)]*)\)/g)].map((match) => match[1]);
    const userOnly = dacl.startsWith('D:P') && aces.length === 1 && aces[0] === `A;;FA;;;${user.sid}`;
    return userOnly && ownedBy(ownerLine(folder, name, run), user);
  } catch {
    return false;
  }
};

export { isUserOnlyFile };
