/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runTesseraCommand } from '../src/commands/tessera.mjs';

const made = [];

const FAKE_CLI = [
  "import { writeFileSync } from 'node:fs';",
  "import { join } from 'node:path';",
  'const runTessera = async (args, options) => {',
  "  writeFileSync(join(import.meta.dirname, 'called.json'), JSON.stringify({ args, cwd: options.cwd }));",
  '  return 3;',
  '};',
  'export { runTessera };',
  '',
].join('\n');

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-tessera-cli-'));
  made.push(root);
  for (const [file, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof text === 'string' ? text : JSON.stringify(text));
  }
  return root;
};

const tesseraAt = (dir, exports = { './cli': './cli.mjs' }) => ({
  [`${dir}node_modules/@drizztdourden08/tessera/package.json`]: { name: '@drizztdourden08/tessera', type: 'module', exports },
  [`${dir}node_modules/@drizztdourden08/tessera/cli.mjs`]: FAKE_CLI,
});

const called = (root, dir = '') => JSON.parse(readFileSync(join(root, `${dir}node_modules/@drizztdourden08/tessera/called.json`), 'utf8'));

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('brock tessera', () => {
  it('hands every word to runTessera with the working folder and returns its exit code', async () => {
    const root = repo({ 'package.json': { name: 'app' }, ...tesseraAt('') });
    expect(await runTesseraCommand({ args: ['new', 'compound', 'SaveSlot', '--help'], cwd: root })).toBe(3);
    expect(called(root)).toEqual({ args: ['new', 'compound', 'SaveSlot', '--help'], cwd: root });
  });

  it('finds Tessera in an app of the workspace when the repo root has none', async () => {
    const root = repo({
      'package.json': { name: 'acme' },
      'pnpm-workspace.yaml': "packages:\n  - 'apps/*'\n",
      'apps/desktop/package.json': { name: '@acme/desktop' },
      'apps/desktop/brock.config.ts': 'export default {};\n',
      ...tesseraAt('apps/desktop/'),
    });
    expect(await runTesseraCommand({ args: ['--help'], cwd: root })).toBe(3);
    expect(called(root, 'apps/desktop/')).toEqual({ args: ['--help'], cwd: root });
  });

  it('says how to install Tessera when it is missing', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = repo({ 'package.json': { name: 'app' } });
    expect(await runTesseraCommand({ args: ['new'], cwd: root })).toBe(1);
    expect(errors).toHaveBeenCalledWith('brock tessera: @drizztdourden08/tessera is not installed in this app; add it with pnpm add -D @drizztdourden08/tessera');
  });

  it('says to update a Tessera without the cli entry', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = repo({ 'package.json': { name: 'app' }, ...tesseraAt('', { '.': './cli.mjs' }) });
    expect(await runTesseraCommand({ args: ['new'], cwd: root })).toBe(1);
    expect(errors.mock.calls[0][0]).toMatch(/has no command line entry/);
  });
});
