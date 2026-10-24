/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { knipScope } from '../src/commands/knip-scope.mjs';
import { appDirs } from './app-dir-harness.mjs';

const BROCK_BIN = resolve(import.meta.dirname, '..', 'bin', 'brock.mjs');
const { appDir, cleanUp } = appDirs('brock-knip-scope-');

const json = (value) => `${JSON.stringify(value)}\n`;

const workspace = () => appDir({
  'package.json': json({ name: 'scope-root', private: true, type: 'module', devDependencies: { vitest: '^4.0.0' } }),
  'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n",
  'vitest.config.mjs': "export default { test: { include: ['apps/*/tests/**/*.test.mjs'] } };\n",
  'knip.json': json({
    ignoreDependencies: ['vitest'],
    workspaces: {
      '.': { entry: ['vitest.config.mjs'], project: ['*.mjs'] },
      'apps/desk': { entry: ['src/main.mjs'], project: ['src/**/*.mjs'] },
    },
  }),
  'apps/desk/package.json': json({ name: 'desk', private: true, type: 'module' }),
  'apps/desk/src/main.mjs': "import { shown } from './shown.mjs';\n\nexport const title = shown();\n",
  'apps/desk/src/shown.mjs': "export const shown = () => 'desk';\n",
  'apps/desk/src/helper.mjs': 'export const onlyTested = () => 1;\n',
  'apps/desk/tests/helper.test.mjs': "import { onlyTested } from '../src/helper.mjs';\n\nexport const result = onlyTested();\n",
});

const knipFrom = (dir) => {
  const run = spawnSync(process.execPath, [BROCK_BIN, 'knip', '--reporter', 'json'], { cwd: dir, encoding: 'utf8' });
  const report = JSON.parse(run.stdout.slice(run.stdout.indexOf('{')));
  return { status: run.status, files: report.issues.flatMap((issue) => issue.files.map((file) => file.name)) };
};

afterEach(cleanUp);

describe('brock knip from an app folder in a workspace', () => {
  it('is as clean as the run from the root, with the test entries and test-only exports', () => {
    const root = workspace();
    expect(knipFrom(root)).toEqual({ status: 0, files: [] });
    expect(knipFrom(join(root, 'apps', 'desk'))).toEqual({ status: 0, files: [] });
  }, 60000);

  it('still reports an unused file of that app', () => {
    const root = workspace();
    writeFileSync(join(root, 'apps', 'desk', 'src', 'orphan.mjs'), 'export const orphan = 1;\n');
    expect(knipFrom(join(root, 'apps', 'desk')).files).toEqual(['apps/desk/src/orphan.mjs']);
  }, 60000);

  it('scopes the run to the member the config names, and leaves other folders and an own scope alone', () => {
    const root = workspace();
    const app = join(root, 'apps', 'desk');
    expect(knipScope(app, ['--debug'])).toEqual({ rootDir: root, args: ['--workspace', 'apps/desk', '--debug'] });
    expect(knipScope(app, ['--workspace', 'other'])).toEqual({ rootDir: app, args: ['--workspace', 'other'] });
    expect(knipScope(root, [])).toEqual({ rootDir: root, args: [] });
    expect(knipScope(join(root, 'apps'), [])).toEqual({ rootDir: join(root, 'apps'), args: [] });
  });
});
