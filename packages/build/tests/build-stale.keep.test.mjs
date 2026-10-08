/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildStaleReason } from '../src/freshness/build-stale-reason.mjs';

const made = [];

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const age = (path, secondsAgo) => {
  const at = new Date(Date.now() - secondsAgo * 1000);
  if (statSync(path).isDirectory()) for (const name of readdirSync(path)) age(join(path, name), secondsAgo);
  utimesSync(path, at, at);
};

const write = (root, files) => {
  for (const [rel, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), content);
  }
};

const BUILT = ['dist/electron/main.js', 'dist/preload/preload.mjs', 'dist/renderer/index.html'];

const tempRoot = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-stale-'));
  made.push(root);
  return root;
};

const builtApp = (root, manifest = { name: 'desktop' }) => {
  write(root, { 'package.json': JSON.stringify(manifest), 'src/main.tsx': 'x', 'electron/main.ts': 'x', ...Object.fromEntries(BUILT.map((file) => [file, file])) });
  age(root, 600);
  BUILT.forEach((file, i) => age(join(root, file), 60 - i * 5));
  return root;
};

const touch = (root, rel) => {
  write(root, { [rel]: 'changed' });
  age(join(root, rel), 1);
};

describe('buildStaleReason', () => {
  it('passes a build newer than every source, whatever node_modules or .brock hold', () => {
    const root = builtApp(tempRoot());
    touch(root, 'node_modules/x/index.js');
    touch(root, '.brock/manifest.json');
    expect(buildStaleReason(root)).toBeNull();
  });

  it('names a missing output and a half build', () => {
    const root = tempRoot();
    write(root, { 'dist/electron/main.js': 'x' });
    expect(buildStaleReason(root)).toMatch(/preload\.mjs is missing/);
    const half = builtApp(tempRoot());
    age(join(half, 'dist/electron/main.js'), 5);
    expect(buildStaleReason(half)).toMatch(/dev launch rebuilt main/);
  });

  it('names the source that changed since the last build', () => {
    const root = builtApp(tempRoot());
    touch(root, 'src/screens/home.page.tsx');
    expect(buildStaleReason(root)).toBe('src changed since the last build');
    const config = builtApp(tempRoot());
    touch(config, 'brock.config.ts');
    expect(buildStaleReason(config)).toBe('brock.config.ts changed since the last build');
  });

  it('reads the workspace packages the app depends on, and only those', () => {
    const root = tempRoot();
    write(root, {
      'pnpm-workspace.yaml': 'packages:\n  - apps/*\n  - packages/*\n',
      'packages/model/package.json': '{"name":"model"}',
      'packages/model/src/index.ts': 'x',
      'packages/other/package.json': '{"name":"other"}',
    });
    const appDir = builtApp(join(root, 'apps', 'desktop'), { name: 'desktop', dependencies: { model: 'workspace:*' } });
    age(join(root, 'packages'), 600);
    touch(root, 'packages/other/src/index.ts');
    touch(root, 'packages/model/node_modules/y.js');
    expect(buildStaleReason(appDir)).toBeNull();
    touch(root, 'packages/model/src/index.ts');
    expect(buildStaleReason(appDir)).toBe('../../packages/model changed since the last build');
  });
});
