/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { findAppDir, resolveNotesRoot } from '../src/index.mjs';
import { releaseVerb } from '../src/release/release-verb.mjs';

const made = [];
afterEach(() => { made.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true })); });

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'thread-notes-root-'));
  made.push(root);
  Object.keys(files).forEach((path) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, files[path]);
  });
  return root;
};

const APP = { 'apps/desktop/brock.config.ts': '' };

describe('findAppDir', () => {
  it('finds the root app, the first app of apps/, or none', () => {
    expect(findAppDir(repo({ 'brock.config.ts': '' }))).toBe('.');
    expect(findAppDir(repo(APP))).toBe('apps/desktop');
    expect(findAppDir(repo({ 'apps/readme.md': '' }))).toBeNull();
    expect(findAppDir(repo({}))).toBeNull();
  });
});

describe('resolveNotesRoot', () => {
  const resolve = (files, rootFallback = true) => resolveNotesRoot({ repoDir: repo(files), appDir: 'apps/desktop', rootFallback });

  it('takes the folder beside the app, empty or not', () => {
    expect(resolve({ ...APP })).toEqual({ root: 'apps/desktop', dir: 'apps/desktop/release-notes', fallback: false });
    expect(resolve({ ...APP, 'apps/desktop/release-notes/v0.1.0.md': '', 'release-notes/v0.1.0.md': '' }).fallback).toBe(false);
  });

  it('falls back to the repo root when only it has the folder', () => {
    expect(resolve({ ...APP, 'release-notes/v0.1.0.md': '' })).toEqual({ root: '.', dir: 'release-notes', fallback: true });
    expect(resolve({ ...APP, 'release-notes/v0.1.0.md': '' }, false).fallback).toBe(false);
  });

  it('keeps a root app at its root', () => {
    expect(resolveNotesRoot({ repoDir: repo({}), appDir: '.', rootFallback: true })).toEqual({ root: '.', dir: 'release-notes', fallback: false });
  });
});

const BAD = '# nothing\n';

const release = async (files, options = {}) => {
  const lines = [];
  const ctx = { rootDir: repo(files), log: (line) => lines.push(line), workspace: {} };
  const error = await releaseVerb.run(['1.0.0'], options, ctx).then(() => null, (thrown) => thrown.message);
  return { error, lines };
};

describe('brock release notes folder', () => {
  it('reads the notes beside the app', async () => {
    const { error, lines } = await release({ ...APP, 'apps/desktop/release-notes/v1.0.0.md': BAD });
    expect(error).toMatch(/^release-notes[\\/]v1\.0\.0\.md does not follow/);
    expect(lines).toEqual([]);
  });

  it('reads the notes at the repo root when the app folder has none, and says so', async () => {
    const { error, lines } = await release({ ...APP, 'release-notes/v1.0.0.md': BAD });
    expect(error).toMatch(/^release-notes[\\/]v1\.0\.0\.md does not follow/);
    expect(lines).toEqual(['No apps/desktop/release-notes; reading release-notes at the repo root.']);
  });

  it('reads the notes of the named app only', async () => {
    const { error, lines } = await release({ ...APP, 'release-notes/v1.0.0.md': BAD }, { app: 'desktop' });
    expect(error).toMatch(/^release-notes[\\/]v1\.0\.0\.md is missing/);
    expect(lines).toEqual([]);
  });
});
