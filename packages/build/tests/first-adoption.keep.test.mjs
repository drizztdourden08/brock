/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runMigrate } from '../src/commands/migrate.mjs';
import { brockPinOf } from '../src/upgrade/brock-pin-of.mjs';

const roots = [];

const packageAt = (root, folder, pkg) => {
  mkdirSync(join(root, folder), { recursive: true });
  writeFileSync(join(root, folder, 'package.json'), JSON.stringify(pkg));
};

const withPackages = (packages, extra = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-first-adoption-'));
  roots.push(root);
  Object.entries(packages).forEach(([folder, pkg]) => packageAt(root, folder, pkg));
  Object.entries(extra).forEach(([file, text]) => writeFileSync(join(root, file), text));
  return root;
};

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

describe('brockPinOf', () => {
  it('reads the app pin, else the workspace root pin, else null', () => {
    const root = withPackages({
      '.': { name: 'root', brock: { version: '0.30.0' } },
      'apps/desktop': { name: 'desktop' },
      'apps/web': { name: 'web', brock: { version: '0.34.0' } },
    }, { 'pnpm-workspace.yaml': 'packages:\n  - apps/*\n' });
    expect(brockPinOf(join(root, 'apps/desktop'))).toBe('0.30.0');
    expect(brockPinOf(join(root, 'apps/web'))).toBe('0.34.0');
    expect(brockPinOf(withPackages({ '.': { name: 'plain' } }))).toBeNull();
  });
});

describe('brock migrate without brock.version', () => {
  it('refuses --from and points to brock adopt', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = withPackages({ '.': { name: 'relic-of-the-past' } }, { 'main.ts': 'export const a = 1;\n' });
    expect(await runMigrate({ rootDir: root, from: '0.1.0' })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('never on Brock'));
    expect(error).toHaveBeenCalledWith(expect.stringContaining('brock adopt'));
    expect(readFileSync(join(root, 'main.ts'), 'utf8')).toBe('export const a = 1;\n');
  });

  it('points to brock adopt when no version is given either', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await runMigrate({ rootDir: withPackages({ '.': { name: 'plain' } }) })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('brock adopt'));
  });

  it('asks for --from when the app is pinned', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await runMigrate({ rootDir: withPackages({ '.': { name: 'app', brock: { version: '0.35.0' } } }) })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('--from <version> is required'));
  });
});
