/* @layer tooling-scripts @kind constants */
const CHILD_PROCESS_MODULES = Object.freeze(['node:child_process', 'child_process']);
const SPAWN_FUNCTIONS = Object.freeze(['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']);
const SPAWN_HIDES_WINDOW_MESSAGE = 'Add windowsHide: true to the options object of {{name}}, so no console window opens on Windows.';
const SPAWN_FILE_GLOBS = Object.freeze(['**/*.{js,mjs,cjs,ts,tsx}']);

export { CHILD_PROCESS_MODULES, SPAWN_FILE_GLOBS, SPAWN_FUNCTIONS, SPAWN_HIDES_WINDOW_MESSAGE };
