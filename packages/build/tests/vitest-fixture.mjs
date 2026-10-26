/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, realpathSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const REPO = resolve(import.meta.dirname, '../../..');
const APP_MODULES = join(REPO, 'templates/app/node_modules');
const VITEST_DIR = realpathSync(join(REPO, 'node_modules/vitest'));
const BROCK_REACT = 'node_modules/@drizztdourden08/brock-react';
const VITEST_CONFIG = "import { defineBrockVitestConfig } from '@drizztdourden08/brock-build/vitest';\nexport default defineBrockVitestConfig(import.meta.dirname);\n";
const APP_PACKAGE = '{ "name": "fixture-app", "version": "0.1.0", "type": "module", "scripts": { "test": "vitest run" }, "dependencies": { "@drizztdourden08/brock-react": "*" } }\n';
const APP_CONFIG = "export default { product: { id: 'fixture', name: 'Fixture' } };\n";

const PROBE = [
  "import { createElement } from 'react';",
  "import { renderToStaticMarkup } from 'react-dom/server';",
  "import { describe, expect, it } from 'vitest';",
  `import { PlatformProvider } from '../${BROCK_REACT}/src/platform/PlatformProvider/PlatformProvider';`,
  '',
  "describe('brock-react in an app test', () => {",
  "  it('renders a component that relies on the automatic JSX runtime', () => {",
  "    expect(renderToStaticMarkup(createElement(PlatformProvider, { children: 'inside' }))).toBe('inside');",
  '  });',
  '});',
  '',
].join('\n');

const link = (target, path) => {
  mkdirSync(dirname(path), { recursive: true });
  symlinkSync(realpathSync(target), path, 'junction');
};

const linkEntry = (dir, parts) => link(join(APP_MODULES, ...parts), join(dir, 'node_modules', ...parts));

const moduleEntries = () => readdirSync(APP_MODULES).flatMap((entry) => (entry.startsWith('@') ? readdirSync(join(APP_MODULES, entry)).map((name) => [entry, name]) : [[entry]]));

/**
 * @param {string} dir a package folder
 * @param {{ skip?: string[] }} [options] skip: package names left out of node_modules
 * @returns {void} node_modules as an app has it
 */
const installApp = (dir, { skip = [] } = {}) => {
  moduleEntries().filter((parts) => !skip.includes(parts.join('/')) && parts[1] !== 'brock-react').forEach((parts) => linkEntry(dir, parts));
  link(VITEST_DIR, join(dir, 'node_modules', 'vitest'));
  const source = join(REPO, 'packages/react');
  cpSync(join(source, 'src'), join(dir, BROCK_REACT, 'src'), { recursive: true });
  cpSync(join(source, 'package.json'), join(dir, BROCK_REACT, 'package.json'));
};

/**
 * @param {string} rootDir a workspace root
 * @returns {void} node_modules with only the tools the root config needs
 */
const linkRootTools = (rootDir) => {
  ['vite', '@drizztdourden08/brock-build'].forEach((name) => linkEntry(rootDir, name.split('/')));
  link(VITEST_DIR, join(rootDir, 'node_modules', 'vitest'));
};

const runVitest = (cwd) => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST')));
  return spawnSync(process.execPath, [join(VITEST_DIR, 'vitest.mjs'), 'run', '--no-color'], { cwd, env, encoding: 'utf8', timeout: 120_000 });
};

export { APP_CONFIG, APP_PACKAGE, PROBE, VITEST_CONFIG, installApp, linkRootTools, runVitest };
