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

const unexpectedEntry = (ace: string, trusted: ReadonlySet<string>): string | null => {
  const [type = '', , rights = '', , , sid = ''] = ace.split(';');
  if (type === 'D' || (type === 'A' && trusted.has(sid))) return null;
  return `${type === 'A' ? '' : `${type} `}${sid || ace} ${rights}`.trim();
};

const readSddl = (sddl: string, trusted: ReadonlySet<string>) => {
  const owner = BRIDGE_SDDL_OWNER.exec(sddl)?.[1] ?? 'unknown';
  const dacl = BRIDGE_SDDL_DACL.exec(sddl);
  const aces = [...(dacl?.[2] ?? '').matchAll(BRIDGE_SDDL_ACE)].map((match) => match[1] ?? '');
  return {
    owner,
    ownerTrusted: trusted.has(owner),
    flags: dacl?.[1] ?? 'none',
    empty: aces.length === 0,
    unexpected: aces.map((ace) => unexpectedEntry(ace, trusted)).filter((entry) => entry !== null),
  };
};

const sddlProblem = (sddl: string, userSid: string): string | null => {
  const read = readSddl(sddl, new Set([userSid, ...BRIDGE_TRUSTED_SIDS]));
  if (read.ownerTrusted && !read.empty && read.unexpected.length === 0) return null;
  const found = [`owner ${read.owner}${read.ownerTrusted ? '' : ' (not trusted)'}`, `access list flags "${read.flags}"`];
  if (read.empty) found.push('no access entries');
  if (read.unexpected.length > 0) found.push(`unexpected entries: ${read.unexpected.join(', ')}`);
  return `${found.join('; ')}; you are ${userSid}`;
};

const windowsAccessProblem = (file: string, run: SystemToolRun = runSystemTool): string | null => {
  try {
    return sddlProblem(sddlOf(resolve(file), run), windowsUser(run).sid);
  } catch (error) {
    return `could not read its owner and access list: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export { windowsAccessProblem };
