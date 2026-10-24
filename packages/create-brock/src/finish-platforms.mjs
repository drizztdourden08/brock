/* @layer tooling-scripts @kind logic */
import { checkMachine, loadBrockConfig, resolvePlatforms, runPlatformPhase, secretsChecklist } from '@drizztdourden08/brock-build';
import { sayLines } from './say-lines.mjs';

const hasToolSteps = (targets) => resolvePlatforms(targets).platforms.some((platform) => platform.scaffold.some((step) => step.phase === 'tools'));

/**
 * @param {string} targetDir
 * @param {{ targets: string[], modules: string[] }} config
 * @param {boolean} installed
 * @returns {Promise<string[]>} next steps for what could not run yet
 */
const finishPlatforms = async (targetDir, config, installed) => {
  const again = `platform add ${config.targets.join(' ')}`;
  const later = [];
  if (installed) {
    const tools = await runPlatformPhase({ rootDir: targetDir, config: await loadBrockConfig(targetDir), phase: 'tools' });
    sayLines('platform steps', tools.lines);
    if (tools.failed) later.push(`${again}   (again, once the failed steps above are fixed)`);
  } else if (hasToolSteps(config.targets)) later.push(`${again}   (after pnpm install: brand icons, cap add android, the Gradle patches)`);
  sayLines('doctor (checks only, installs nothing)', checkMachine({ rootDir: targetDir, targets: config.targets, modules: config.modules }).lines);
  sayLines('release secrets', secretsChecklist(config.targets));
  return later;
};

export { finishPlatforms };
