/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runAdopt } from '../src/commands/adopt.mjs';
import { runMigrate } from '../src/commands/migrate.mjs';
import { OWN_PACKAGE } from '../src/modules/sync.mjs';
import { brockPinOf } from '../src/upgrade/brock-pin-of.mjs';

const made = [];

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-first-adoption-'));
  made.push(root);
  for (const [file, value] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  }
  return root;
};

const pinOf = (root) => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).brock?.version;

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('brock adopt on an app that was never on Brock', () => {
  it('pins brock.version to the Brock version it adopts', async () => {
    const root = repo({ 'package.json': { name: 'relic-of-the-past', version: '0.20.7' } });
    expect(await runAdopt({ rootDir: root, scope: '@rotp' })).toBe(0);
    expect(pinOf(root)).toBe(OWN_PACKAGE.version);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`brock.version ${OWN_PACKAGE.version}`));
  });

  it('keeps a pin the repo already has', async () => {
    const root = repo({ 'package.json': { name: 'older', brock: { version: '0.20.0' } } });
    expect(await runAdopt({ rootDir: root, scope: '@older' })).toBe(0);
    expect(pinOf(root)).toBe('0.20.0');
  });
});

describe('brockPinOf', () => {
  it('reads the app pin, else the workspace root pin, else null', () => {
    const root = repo({
      'package.json': { name: 'root', brock: { version: '0.30.0' } },
      'pnpm-workspace.yaml': 'packages:\n  - apps/*\n',
      'apps/desktop/package.json': { name: 'desktop' },
      'apps/web/package.json': { name: 'web', brock: { version: '0.34.0' } },
    });
    expect(brockPinOf(join(root, 'apps/desktop'))).toBe('0.30.0');
    expect(brockPinOf(join(root, 'apps/web'))).toBe('0.34.0');
    expect(brockPinOf(repo({ 'package.json': { name: 'plain' } }))).toBeNull();
  });
});

describe('brock migrate without brock.version', () => {
  it('refuses --from and points to brock adopt', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const root = repo({ 'package.json': { name: 'relic-of-the-past' }, 'src/a.ts': 'export const a = 1;\n' });
    expect(await runMigrate({ rootDir: root, from: '0.1.0' })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('never on Brock'));
    expect(error).toHaveBeenCalledWith(expect.stringContaining('brock adopt'));
    expect(readFileSync(join(root, 'src/a.ts'), 'utf8')).toBe('export const a = 1;\n');
  });

  it('points to brock adopt when no version is given either', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await runMigrate({ rootDir: repo({ 'package.json': { name: 'plain' } }) })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('brock adopt'));
  });

  it('asks for --from when the app is pinned', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await runMigrate({ rootDir: repo({ 'package.json': { name: 'app', brock: { version: '0.35.0' } } }) })).toBe(1);
    expect(error).toHaveBeenCalledWith(expect.stringContaining('--from <version> is required'));
  });
});
