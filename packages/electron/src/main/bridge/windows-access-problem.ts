/* @layer electron-main @kind logic */
import { resolve } from 'path';
import type { SystemToolRun } from './bridge.type';
import { BRIDGE_ACL_ENV, BRIDGE_ACL_SCRIPT, BRIDGE_POWERSHELL, BRIDGE_TRUSTED_SIDS } from './bridge.constants';
import { runSystemTool } from './run-system-tool';
import { windowsUser } from './windows-user';

const aclLines = (file: string, run: SystemToolRun): string[] =>
  run(BRIDGE_POWERSHELL, ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', BRIDGE_ACL_SCRIPT], { env: { [BRIDGE_ACL_ENV]: file } })
    .toString('latin1')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const valueOf = (lines: readonly string[], tag: string): string | null => lines.find((line) => line.startsWith(`${tag} `))?.slice(tag.length + 1) ?? null;

const isTrustedEntry = (entry: string, trusted: ReadonlySet<string>): boolean => {
  const [type = '', sid = ''] = entry.split(' ');
  return type === 'Deny' || (type === 'Allow' && trusted.has(sid));
};

const readAcl = (lines: readonly string[], trusted: ReadonlySet<string>) => {
  const owner = valueOf(lines, 'O') ?? 'unknown';
  const entries = lines.filter((line) => line.startsWith('E ')).map((line) => line.slice(2));
  return {
    owner,
    ownerTrusted: trusted.has(owner),
    protectedList: valueOf(lines, 'P') ?? 'unknown',
    empty: entries.length === 0,
    unexpected: entries.filter((entry) => !isTrustedEntry(entry, trusted)),
  };
};

const aclProblem = (lines: readonly string[], userSid: string): string | null => {
  const read = readAcl(lines, new Set([userSid, ...BRIDGE_TRUSTED_SIDS]));
  if (read.ownerTrusted && !read.empty && read.unexpected.length === 0) return null;
  const found = [`owner ${read.owner}${read.ownerTrusted ? '' : ' (not trusted)'}`, `access list protected: ${read.protectedList}`];
  if (read.empty) found.push('no access entries');
  if (read.unexpected.length > 0) found.push(`unexpected entries: ${read.unexpected.join(' | ')}`);
  return `${found.join('; ')}; you are ${userSid}`;
};

const windowsAccessProblem = (file: string, run: SystemToolRun = runSystemTool): string | null => {
  try {
    return aclProblem(aclLines(resolve(file), run), windowsUser(run).sid);
  } catch (error) {
    return `could not read its owner and access list: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export { windowsAccessProblem };
