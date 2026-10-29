/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const exec = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', async (actual) => ({ ...(await actual()), execFileSync: exec }));

const { installDependencies } = await import('../src/worktree/install.mjs');

const made = [];
afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
  exec.mockReset();
});

const workspace = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-install-'));
  made.push(root);
  mkdirSync(join(root, 'apps', 'desktop'), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{}');
  writeFileSync(join(root, 'apps', 'desktop', 'package.json'), '{}');
  return root;
};

describe('installDependencies', () => {
  it('installs a workspace once when the root install also fills the app, even with two targets on one app', () => {
    const root = workspace();
    exec.mockImplementation((_command, _args, { cwd }) => {
      mkdirSync(join(cwd, 'node_modules'), { recursive: true });
      if (cwd === root) mkdirSync(join(root, 'apps', 'desktop', 'node_modules'), { recursive: true });
    });
    const appDir = () => join(root, 'apps', 'desktop');
    const ctx = { targets: { desktop: { appDir }, server: { appDir } }, log: () => {} };
    installDependencies({ path: root }, {}, ctx);
    expect(exec.mock.calls.map(([, , options]) => options.cwd)).toEqual([root]);
  });

  it('still installs an app the root install left without node_modules, once', () => {
    const root = workspace();
    exec.mockImplementation((_command, _args, { cwd }) => mkdirSync(join(cwd, 'node_modules'), { recursive: true }));
    const appDir = () => join(root, 'apps', 'desktop');
    const ctx = { targets: { desktop: { appDir }, server: { appDir } }, log: () => {} };
    installDependencies({ path: root }, {}, ctx);
    expect(exec.mock.calls.map(([, , options]) => options.cwd)).toEqual([root, join(root, 'apps', 'desktop')]);
  });
});
