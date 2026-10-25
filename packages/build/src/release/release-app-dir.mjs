/* @layer tooling-scripts @kind logic */
import { findAppDir } from '@drizztdourden08/brock-thread';

const DEFAULT_APP_DIR = 'apps/desktop';

/**
 * @param {string} rootDir the repo root
 * @returns {string} the app the release workflow packages
 */
const releaseAppDir = (rootDir) => findAppDir(rootDir) ?? DEFAULT_APP_DIR;

export { releaseAppDir };
