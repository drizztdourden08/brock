/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const knowsUpgrade = (bin) => existsSync(join(dirname(dirname(bin)), 'src', 'upgrade'));

/**
 * @param {string | undefined} command the first word after brock
 * @param {import('./find-project-build.mjs').ProjectBuild | null} project
 * @param {string} globalBin the brock-build bin this package carries
 * @returns {string} the bin that runs the command
 */
const runnerFor = (command, project, globalBin) => {
  if (!project) return globalBin;
  return command === 'upgrade' && !knowsUpgrade(project.bin) ? globalBin : project.bin;
};

export { runnerFor };
