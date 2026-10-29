/* @layer tooling-scripts @kind constants */
const CLONE_RECORD = '.brock-clone.json';
const STORE_RECORD = '.brock-store.json';
const STORE_LAYOUT = 3;
const STORE_USERS = 'users';
const STORE_ENV = 'BROCK_MODULES_STORE_DIR';
const STORE_HOME_FOLDERS = ['.brock', 'cache', 'node-modules'];
const STORE_VOLUME_FOLDERS = ['.brock-store', 'node-modules'];
const MODULES_STATE = '.modules.yaml';
const WORKSPACE_STATE = '.pnpm-workspace-state-v1.json';
const INSTALLED_LOCKFILE = 'lock.yaml';
const LOCKFILE = 'pnpm-lock.yaml';
const INSTALL_INPUTS = ['.pnpmfile.cjs', 'pnpm-workspace.yaml', '.npmrc', 'package.json'];
const STATE_KEYS = ['layoutVersion', 'nodeLinker', 'hoistPattern', 'publicHoistPattern', 'included', 'skipped', 'injectedDeps'];
const KEPT_DOT_ENTRIES = new Set(['.bin', MODULES_STATE, WORKSPACE_STATE]);

export {
  CLONE_RECORD,
  INSTALL_INPUTS,
  INSTALLED_LOCKFILE,
  KEPT_DOT_ENTRIES,
  LOCKFILE,
  MODULES_STATE,
  STATE_KEYS,
  STORE_ENV,
  STORE_HOME_FOLDERS,
  STORE_LAYOUT,
  STORE_RECORD,
  STORE_USERS,
  STORE_VOLUME_FOLDERS,
  WORKSPACE_STATE,
};
