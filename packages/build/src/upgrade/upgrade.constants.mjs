/* @layer tooling-scripts @kind constants */
import { join } from 'node:path';

const OWN_MIGRATIONS_DIR = join(import.meta.dirname, '..', '..', 'migrations');
const OWN_SOURCE = '@drizztdourden08/brock-build';
const VERSION_FOLDER = /^\d+\.\d+\.\d+$/;
const NOT_OWNED_DIRS = new Set(['node_modules', 'dist', 'out', 'release', 'coverage', '.git', '.brock', '.user-data', '.worktrees', '.vite']);

export { NOT_OWNED_DIRS, OWN_MIGRATIONS_DIR, OWN_SOURCE, VERSION_FOLDER };
