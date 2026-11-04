/* @layer tooling-scripts @kind logic */
import { runPlatformAdd } from './platform-add.mjs';

/**
 * @param {string} rootDir
 * @param {string} input an alias such as mobile
 * @param {string} [local] the --local flag value
 * @returns {Promise<number>} exit code
 */
const addTargetAlias = async (rootDir, input, local) => {
  if (local) console.log(`brock add: ${input} is a platform target, so --local does not apply`);
  const code = await runPlatformAdd(rootDir, [input]);
  if (code !== 0) return code;
  console.log('brock add: next, run `<app> mobile build` for the APK and `<app> mobile keystore` for the release keystore');
  return 0;
};

export { addTargetAlias };
