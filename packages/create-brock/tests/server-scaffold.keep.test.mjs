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

describe('create-brock --platforms server', () => {
  it('writes a windowless app: the entry, the managed server files and no Electron files', async () => {
    const dir = await scaffoldInto(['server']);
    for (const path of ['server/main.ts', 'server/start.ts', 'build/server/fixture.service', 'build/server/Dockerfile', 'build/server/postinst', 'build/server/prerm', 'tsconfig.json', '.github/workflows/ci.yml', '.github/workflows/release.yml']) {
      expect(has(dir, path), path).toBe(true);
    }
    for (const path of ['electron', 'src', 'electron.vite.config.ts', 'electron-builder.config.cjs', '.brock/boot.main.ts', 'tessera.config.json']) {
      expect(has(dir, path), path).toBe(false);
    }
  });

  it('writes a main that calls runServer with createDataDomains, and a start that logs a line', async () => {
    const dir = await scaffoldInto(['server']);
    const main = read(dir, 'server/main.ts');
    expect(main).toContain("from '@drizztdourden08/brock-electron/server'");
    expect(main).toContain('runServer(start, { domains: (dataDir) => createDataDomains(dataDir, dataDomains) })');
    expect(read(dir, 'server/start.ts')).toContain('host.log(');
  });

  it('records the server target and the identity in brock.config.ts', async () => {
    const dir = await scaffoldInto(['server']);
    const config = read(dir, 'brock.config.ts');
    expect(config).toContain("targets: ['server']");
    expect(config).toContain("id: 'fixture'");
    expect(config).not.toContain('brock-template-app');
    expect(read(dir, 'brock.workspace.mjs')).toContain('serverTarget({ app: \'.\' })');
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

  it('includes server in the tsconfig and lists the entry for knip', async () => {
    const dir = await scaffoldInto(['server']);
    expect(read(dir, 'tsconfig.json')).toContain('"server"');
    const knip = JSON.parse(read(dir, 'knip.json'));
    expect(knip.entry).toContain('server/main.ts');
    expect(knip.project).toContain('server/**/*.ts');
  });

  it('puts the server jobs in the workflows and no review job', async () => {
    const dir = await scaffoldInto(['server']);
    expect(read(dir, '.github/workflows/ci.yml')).toMatch(/^ {2}server:/m);
    expect(read(dir, '.github/workflows/ci.yml')).not.toMatch(/^ {2}review:/m);
    expect(read(dir, '.github/workflows/release.yml')).toContain('build-server:');
  });
});

describe('create-brock --platforms desktop,server', () => {
  it('writes the desktop app and the server files side by side', async () => {
    const dir = await scaffoldInto(['desktop', 'server']);
    for (const path of ['electron/main.ts', 'src/main.tsx', 'electron.vite.config.ts', 'server/main.ts', 'server/start.ts', 'build/server/Dockerfile']) {
      expect(has(dir, path), path).toBe(true);
    }
    expect(read(dir, 'brock.config.ts')).toContain("targets: ['desktop', 'server']");
  });

  it('embeds the server in the desktop main through a boot task', async () => {
    const dir = await scaffoldInto(['desktop', 'server']);
    const task = read(dir, 'electron/boot/server.task.ts');
    expect(task).toContain("import { defineBootTask, embedServer } from '@drizztdourden08/brock-electron/main'");
    expect(task).toContain('embedServer(start, ctx');
    expect(read(dir, '.brock/boot.main.ts')).toContain("{ ...serverTask, id: 'server' }");
  });

  it('keeps the desktop dependencies and builds Electron on install', async () => {
    const dir = await scaffoldInto(['desktop', 'server']);
    const pkg = JSON.parse(read(dir, 'package.json'));
    expect(pkg.dependencies.react).toBe('catalog:');
    expect(pkg.main).toBe('dist/electron/main.js');
    expect(read(dir, 'pnpm-workspace.yaml')).toContain('  - electron');
    expect(JSON.parse(read(dir, 'knip.json')).entry).toContain('server/main.ts');
  });
});

describe('create-brock for the desktop alone', () => {
  it('writes no server file', async () => {
    const dir = await scaffoldInto(['desktop']);
    expect(has(dir, 'server')).toBe(false);
    expect(has(dir, 'build/server')).toBe(false);
    expect(has(dir, 'electron/boot/server.task.ts')).toBe(false);
  });
});
