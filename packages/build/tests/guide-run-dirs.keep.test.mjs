/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { guideRunDirs } from '../src/tessera/guide-run-dirs.mjs';
import { writeGuide } from '../src/tessera/write-guide.mjs';

const made = [];

const FAKE_CLI = [
  "import { writeFileSync } from 'node:fs';",
  "import { join } from 'node:path';",
  'const runTessera = async (args, options) => {',
  "  writeFileSync(join(import.meta.dirname, 'called.json'), JSON.stringify({ args, cwd: options.cwd }));",
  '  return 0;',
  '};',
  'export { runTessera };',
  '',
].join('\n');

const TESSERA = { '@drizztdourden08/tessera': '^0.25.0' };

const CONFIG = {
  package: '@acme/design',
  parts: { compounds: 'packages/design/src/compounds' },
  guide: { parts: 'packages/design/src/guide/parts.type.ts' },
  apps: { 'apps/desktop': { parts: { views: 'apps/desktop/src/views' }, guide: { parts: 'apps/desktop/src/guide/parts.type.ts' } } },
};

const put = (root) => ([file, text]) => {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof text === 'string' ? text : JSON.stringify(text));
};

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-guide-run-'));
  made.push(root);
  Object.entries(files).forEach(put(root));
  return root;
};

const tesseraAt = (dir) => ({
  [`${dir}node_modules/@drizztdourden08/tessera/package.json`]: { name: '@drizztdourden08/tessera', type: 'module', exports: { './cli': './cli.mjs' } },
  [`${dir}node_modules/@drizztdourden08/tessera/cli.mjs`]: FAKE_CLI,
});

const workspace = (extra = {}) => repo({
  'package.json': { name: 'acme' },
  'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
  'tessera.config.json': CONFIG,
  'apps/desktop/package.json': { name: '@acme/desktop', devDependencies: TESSERA },
  'apps/desktop/brock.config.ts': 'export default {};\n',
  'packages/catalog/package.json': { name: '@acme/catalog' },
  'packages/design/package.json': { name: '@acme/design', dependencies: TESSERA },
  ...extra,
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('guideRunDirs', () => {
  it('runs at the config folder when it has Tessera', () => {
    const root = workspace({ 'package.json': { name: 'acme', devDependencies: TESSERA } });
    expect(guideRunDirs(root)).toEqual([root]);
  });

  it('runs in the package outside the apps entries that has Tessera when the repo root has none', () => {
    const root = workspace();
    expect(guideRunDirs(root)).toEqual([join(root, 'packages', 'design')]);
  });

  it('runs in each app with Tessera when no other package has it, and at the config folder when none does', () => {
    const appsOnly = workspace({ 'packages/design/package.json': { name: '@acme/design' } });
    expect(guideRunDirs(appsOnly)).toEqual([join(appsOnly, 'apps', 'desktop')]);
    const none = workspace({ 'packages/design/package.json': { name: '@acme/design' }, 'apps/desktop/package.json': { name: '@acme/desktop' } });
    expect(guideRunDirs(none)).toEqual([none]);
  });
});

describe('writeGuide in a workspace app', () => {
  it('reads the root tessera.config.json and runs tessera guide where Tessera is installed', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const root = workspace(tesseraAt('packages/design/'));
    await writeGuide(join(root, 'apps', 'desktop'));
    const called = JSON.parse(readFileSync(join(root, 'packages/design/node_modules/@drizztdourden08/tessera/called.json'), 'utf8'));
    expect(called).toEqual({ args: ['guide'], cwd: join(root, 'packages', 'design') });
    expect(existsSync(join(root, 'node_modules'))).toBe(false);
  });
});
