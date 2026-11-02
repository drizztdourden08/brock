/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { THREAD_VERBS } from './thread-verbs.constants.mjs';

const knowsUpgrade = (bin) => existsSync(join(dirname(dirname(bin)), 'src', 'upgrade'));

/**
 * @param {string | undefined} command the first word after brock
 * @param {import('./find-project-build.mjs').ProjectBuild | null} project
 * @param {string} globalBin the brock-build bin this package carries
 * @param {import('./find-installed.mjs').InstalledPackage | null} [thread] the project's brock-thread
 * @returns {string} the bin that runs the command
 */
const runnerFor = (command, project, globalBin, thread = null) => {
  if (project) return command === 'upgrade' && !knowsUpgrade(project.bin) ? globalBin : project.bin;
  return thread && THREAD_VERBS.has(command) ? thread.bin : globalBin;
};

export { runnerFor };
