/* @layer tooling-scripts @kind test */
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scaffold } from '../src/scaffold.mjs';

const made = [];

const IDENTITY = { id: 'fixture', name: 'Fixture', appId: 'com.example.fixture', authorName: 'Tester', authorEmail: 'tester@example.com' };

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const scaffoldInto = async (targets) => {
  const root = mkdtempSync(join(tmpdir(), 'create-brock-server-'));
  made.push(root);
  const targetDir = join(root, 'app');
  const code = await scaffold({ targetDir, identity: IDENTITY, modules: [], targets, local: null, tessera: null, install: false });
  expect(code).toBe(0);
  return targetDir;
};

const read = (dir, path) => readFileSync(join(dir, path), 'utf8');

const has = (dir, path) => existsSync(join(dir, path));

describe('E2 create-brock --platforms server', { tags: ['e2e'] }, () => {
  it('writes a windowless app: the entry, the managed server files and no Electron files', async () => {
    const dir = await scaffoldInto(['server']);
    for (const path of ['server/main.ts', 'server/start.ts', 'server/data-domains.ts', 'build/server/fixture.service', 'build/server/Dockerfile', 'build/server/postinst', 'build/server/prerm', 'tsconfig.json', '.github/workflows/ci.yml', '.github/workflows/release.yml']) {
      expect(has(dir, path), path).toBe(true);
    }
    for (const path of ['electron', 'src', 'electron.vite.config.ts', 'electron-builder.config.cjs', '.brock/boot.main.ts', 'tessera.config.json']) {
      expect(has(dir, path), path).toBe(false);
    }
  });

  it('depends on no Electron, React or Tessera package and does not build Electron on install', async () => {
    const dir = await scaffoldInto(['server']);
    const pkg = JSON.parse(read(dir, 'package.json'));
    const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(names.filter((name) => /^(electron|react|react-dom|zustand|velopack)/.test(name) || name.includes('tessera'))).toEqual([]);
    expect(pkg.main).toBeUndefined();
    expect(pkg.scripts.build).toBe('brock build');
    expect(pkg.dependencies['@drizztdourden08/brock-electron']).toMatch(/^\^/);
    const workspace = read(dir, 'pnpm-workspace.yaml');
    expect(workspace).toContain('  - esbuild');
    expect(workspace).not.toContain('  - electron');
  });
});

describe('E2 create-brock --platforms desktop,server', { tags: ['e2e'] }, () => {
  it('writes the desktop app and the server files side by side', async () => {
    const dir = await scaffoldInto(['desktop', 'server']);
    for (const path of ['electron/main.ts', 'src/main.tsx', 'electron.vite.config.ts', 'server/main.ts', 'server/start.ts', 'build/server/Dockerfile']) {
      expect(has(dir, path), path).toBe(true);
    }
    expect(read(dir, 'brock.config.ts')).toContain("targets: ['desktop', 'server']");
  });
});
