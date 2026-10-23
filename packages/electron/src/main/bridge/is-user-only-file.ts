/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import {
  BRIDGE_ACL_ENV, BRIDGE_ACL_SCRIPT, BRIDGE_POWERSHELL, BRIDGE_SDDL_ACE, BRIDGE_SDDL_DACL, BRIDGE_SDDL_OWNER, BRIDGE_TRUSTED_SIDS,
} from './bridge.constants';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const sddlOf = (file: string, run: SystemToolRun): string =>
  run(BRIDGE_POWERSHELL, ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', BRIDGE_ACL_SCRIPT], { env: { [BRIDGE_ACL_ENV]: file } }).toString('latin1').trim();

const allowsOnly = (ace: string, trusted: ReadonlySet<string>): boolean => {
  const [type = '', , , , , sid = ''] = ace.split(';');
  if (type === 'D') return true;
  return type === 'A' && trusted.has(sid);
};

const sddlIsPrivate = (sddl: string, userSid: string): boolean => {
  const trusted = new Set([userSid, ...BRIDGE_TRUSTED_SIDS]);
  const owner = BRIDGE_SDDL_OWNER.exec(sddl)?.[1];
  const aces = [...(BRIDGE_SDDL_DACL.exec(sddl)?.[2] ?? '').matchAll(BRIDGE_SDDL_ACE)].map((match) => match[1] ?? '');
  return owner !== undefined && trusted.has(owner) && aces.length > 0 && aces.every((ace) => allowsOnly(ace, trusted));
};

const isUserOnlyFile = (file: string, run: SystemToolRun = runSystemTool): boolean => {
  try {
    return sddlIsPrivate(sddlOf(resolve(file), run), windowsUser(run).sid);
  } catch {
    return false;
  }
};

export { isUserOnlyFile };
