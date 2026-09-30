/* @layer tooling-scripts @kind logic */
import { targetInputProblem } from '../platforms/target-input-problem.mjs';
import { configTargets } from './config-targets.mjs';
import { platformListLines } from './platform-list.mjs';
import { runPlatformAdd } from './platform-add.mjs';
import { runPlatformRemove } from './platform-remove.mjs';
import { PLATFORM_USAGE } from './platform.constants.mjs';

const edits = { add: runPlatformAdd, remove: runPlatformRemove };

/**
 * @param {{ rootDir: string, args?: string[] }} ctx args are the words after platform
 * @returns {Promise<number>} exit code
 */
const runPlatform = async ({ rootDir, args = [] }) => {
  const [sub, ...inputs] = args;
  if (sub === 'list') {
    for (const line of platformListLines(configTargets(rootDir).targets)) console.log(line);
    return 0;
  }
  const edit = edits[sub];
  if (!edit) {
    console.error(PLATFORM_USAGE);
    return 1;
  }
  const problem = targetInputProblem(inputs);
  if (problem) {
    console.error(`brock platform ${sub}: ${problem}`);
    return 1;
  }
  return edit(rootDir, inputs);
};

export { runPlatform };
