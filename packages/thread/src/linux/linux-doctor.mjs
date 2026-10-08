/* @layer tooling-scripts @kind logic */
import { linuxChecks } from './linux-checks.mjs';
import { loadMachine } from './linux-machine.mjs';
import { disposeKey, privateKeyPath } from './private-key.mjs';
import { remoteTarget } from './remote.mjs';

/**
 * @param {import('./linux-checks.mjs').LinuxCheck} check
 * @returns {string[]}
 */
const reportLines = (check) => [
  `  ${check.ok ? 'ok  ' : 'MISS'} ${check.label}: ${check.detail}`,
  ...(!check.ok && check.hint ? [`       ${check.hint}`] : []),
];

/**
 * @param {import('../workspace/workspace.type.mjs').ThreadContext} ctx
 * @returns {number} 0 when every check passed
 */
const linuxDoctor = (ctx) => {
  const machine = loadMachine(ctx.workspace.name);
  const key = privateKeyPath(machine);
  try {
    const checks = linuxChecks(machine, remoteTarget(machine, key));
    ctx.log(`Linux push on this machine (${machine.file}, builds in ${machine.builder === 'wsl' ? `WSL ${machine.wslDistro}` : 'the VM'}):`);
    for (const line of checks.flatMap(reportLines)) console.log(line);
    return checks.every((check) => check.ok) ? 0 : 1;
  } finally {
    disposeKey(machine, key);
  }
};

export { linuxDoctor };
