/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { promisify } from 'util';
import { POWERSHELL, RULE_PROTOCOLS } from './firewall.constants';
import type { FirewallStatus } from './lan.type';
import { readFirewallStatus } from './read-firewall-status';

const run = promisify(execFile);

const quoted = (text: string): string => text.replace(/'/g, "''");

const addRuleArgs = (ruleName: string, protocol: string): string =>
  `advfirewall firewall add rule name="${ruleName}" dir=in action=allow program="${process.execPath}" protocol=${protocol} enable=yes profile=any`;

const elevatedCommand = (ruleName: string): string => {
  const calls = RULE_PROTOCOLS.map(
    (protocol) => `Start-Process netsh -Verb RunAs -WindowStyle Hidden -Wait -ArgumentList '${quoted(addRuleArgs(ruleName, protocol))}'`,
  );
  return calls.join('; ');
};

const allowFirewall = async (ruleName: string): Promise<FirewallStatus> => {
  if (process.platform !== 'win32') return 'unknown';
  await run(POWERSHELL, ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', elevatedCommand(ruleName)], { windowsHide: true })
    .catch(() => undefined);
  return readFirewallStatus();
};

export { allowFirewall };
