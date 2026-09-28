/* @layer tooling-scripts @kind logic */
import { basename } from 'node:path';
import { appDirs } from './app-dirs.mjs';

const THREAD = '@drizztdourden08/brock-thread';

const targetKey = (dir) => (dir === '.' ? 'app' : basename(dir).replace(/[^a-z0-9]/gi, '').toLowerCase() || 'app');

const targetLines = (dirs) => dirs.map((dir) => `    ${targetKey(dir)}: electronTarget({ app: '${dir}' }),`).join('\n');

/**
 * @param {string} rootDir
 * @param {string} name the workspace name, the alias
 * @returns {string} brock.workspace.mjs content
 */
const workspaceConfig = (rootDir, name) => {
  const dirs = appDirs(rootDir);
  const imports = dirs.length ? 'defineWorkspace, electronTarget, brockProfile' : 'defineWorkspace';
  const targets = dirs.length ? `  targets: {\n${targetLines(dirs)}\n  },\n  provision: [brockProfile()],\n` : '  targets: {},\n';
  return `/* @layer root-config @kind config */\nimport { ${imports} } from '${THREAD}';\n\nexport default defineWorkspace({\n  name: '${name}',\n  base: 'main',\n${targets}});\n`;
};

export { workspaceConfig, THREAD };
