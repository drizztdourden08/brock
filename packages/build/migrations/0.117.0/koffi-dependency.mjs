/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageJson } from '../../src/upgrade/design/package-json.mjs';

const ELECTRON = '@drizztdourden08/brock-electron';
const FALLBACK_SPEC = '^3.1.2';

const installedSpec = (rootDir) => {
  try {
    const file = join(rootDir, 'node_modules', ...ELECTRON.split('/'), 'package.json');
    const spec = JSON.parse(readFileSync(file, 'utf8')).dependencies?.koffi;
    return typeof spec === 'string' && !spec.startsWith('workspace:') && spec !== 'catalog:' ? spec : FALLBACK_SPEC;
  } catch {
    return FALLBACK_SPEC;
  }
};

const workspace = ({ rootDir }) => {
  const file = join(rootDir, 'package.json');
  if (!existsSync(file)) return { touched: [] };
  const pkg = packageJson.read(file);
  if (!pkg.dependencies?.[ELECTRON]) return { touched: [] };
  if (!packageJson.addDependencies(file, { koffi: installedSpec(rootDir) })) return { touched: [] };
  return { touched: ['package.json'], todos: [{ file: 'package.json', line: null, message: 'koffi was added to dependencies; run pnpm install so the app resolves it.' }] };
};

const migration = Object.freeze({
  id: 'koffi-dependency',
  summary: 'The OS integration calls Windows in process through koffi, and the app bundle loads it from the app\'s own node_modules, so the app declares it. The migration adds koffi to dependencies of an app that uses @drizztdourden08/brock-electron and does not list it yet.',
  workspace,
});

export { migration };
