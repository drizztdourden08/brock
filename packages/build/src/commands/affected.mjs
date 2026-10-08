/* @layer tooling-scripts @kind logic */
import { affectsApp, changedSince } from '../release/affected-app.mjs';

/**
 * @param {{ rootDir: string, args: string[] }} ctx rootDir is the repo root
 * @returns {number} exit code; prints true or false
 */
const runAffected = ({ rootDir, args }) => {
  const [appDir, base] = args;
  if (!appDir) {
    console.error('brock affected <app folder> [base ref]: prints true when the changes since the base touch the app');
    return 1;
  }
  console.log(String(!base || affectsApp({ rootDir, appDir, files: changedSince(rootDir, base) })));
  return 0;
};

export { runAffected };
