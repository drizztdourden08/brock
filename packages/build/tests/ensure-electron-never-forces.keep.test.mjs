/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const exec = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', () => ({ execSync: exec }));

const { ensureElectron } = await import('../src/ensure-electron.mjs');
const { brockWorkspace, removeTempRepos } = await import('./temp-repo.mjs');

afterEach(() => {
  removeTempRepos();
  exec.mockReset();
});

const ELECTRON_PACKAGE = '{ "name": "electron", "version": "40.0.0" }\n';

describe('ensure-electron', () => {
  it('re-runs the install script of the package, never a pnpm install, and fails with the command to run', () => {
    const root = brockWorkspace({
      'apps/desktop/node_modules/electron/package.json': ELECTRON_PACKAGE,
      'apps/desktop/node_modules/electron/install.js': '\n',
    });
    const result = ensureElectron(join(root, 'apps', 'desktop'));
    expect(result.ok).toBe(false);
    expect(result.message).toContain(`run \`pnpm install\` in ${root}`);
    const commands = exec.mock.calls.map(([command]) => command);
    expect(commands).toHaveLength(1);
    expect(commands[0]).toContain('install.js');
    expect(commands.join('\n')).not.toMatch(/pnpm|--force/);
  });

  it('names the app folder as the install folder when the app is the repo', () => {
    const root = brockWorkspace({ 'node_modules/electron/package.json': ELECTRON_PACKAGE });
    const result = ensureElectron(root);
    expect(result.ok).toBe(false);
    expect(result.message).toContain(`in ${root} and retry`);
    expect(exec).not.toHaveBeenCalled();
  });
});
