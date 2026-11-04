/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { copyAssetBlob } from '../src/rom/copy-asset-blob-step.mjs';

const dirs = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const setup = (blobs) => {
  const root = mkdtempSync(join(tmpdir(), 'snes-blob-'));
  dirs.push(root);
  const realDataDir = join(root, 'real');
  mkdirSync(join(realDataDir, 'assets'), { recursive: true });
  for (const blob of blobs) writeFileSync(join(realDataDir, 'assets', blob), 'blob');
  const rom = join(root, 'game.sfc');
  writeFileSync(rom, 'rom');
  const lines = [];
  const worktree = {
    path: join(root, 'wt'),
    main: join(root, 'main'),
    name: 'wt',
    userData: join(root, 'user'),
    workspace: undefined,
    log: (line) => lines.push(line),
  };
  const assets = join(worktree.userData, 'Data', 'assets');
  return { realDataDir, rom, worktree, lines, assets };
};

describe('K2 copyAssetBlob source blob name', { tags: ['critical'] }, () => {
  it('copies a named asset to the ROM stem name', () => {
    const { realDataDir, rom, worktree, assets } = setup(['ct_assets.dat']);
    copyAssetBlob({ realDataDir, rom, asset: 'ct_assets.dat' }).run(worktree);
    expect(existsSync(join(assets, 'game.dat'))).toBe(true);
    expect(existsSync(join(assets, 'ct_assets.dat'))).toBe(false);
  });

  it('keeps the old source name when no asset is given', () => {
    const { realDataDir, rom, worktree, assets } = setup(['game.dat']);
    copyAssetBlob({ realDataDir, rom }).run(worktree);
    expect(existsSync(join(assets, 'game.dat'))).toBe(true);
  });

  it('logs a neutral line and copies nothing for a missing blob', () => {
    const { realDataDir, rom, worktree, lines, assets } = setup([]);
    copyAssetBlob({ realDataDir, rom, asset: 'ct_assets.dat' }).run(worktree);
    expect(existsSync(join(assets, 'game.dat'))).toBe(false);
    expect(lines).toContain(`No pre-extracted asset blob ct_assets.dat in ${join(realDataDir, 'assets')}; nothing copied.`);
  });
});
