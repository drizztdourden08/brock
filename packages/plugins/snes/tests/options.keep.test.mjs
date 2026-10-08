/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { snes } from '../src/snes-verb.mjs';
import { snesOptions } from '../src/snes-options.mjs';

const KNOWN = { '0123456789ABCDEF0123456789ABCDEF01234567': 'sample-us' };

describe('snes defaults carry no game of their own', () => {
  it('knows no ROM until the workspace lists its own', () => {
    expect(snesOptions('roms', undefined).sha1).toEqual({});
    expect(snesOptions('roms', { snes: { roms: { sha1: KNOWN } } }).sha1).toEqual(KNOWN);
  });

  it('writes the core where port kit does unless the workspace says otherwise', () => {
    expect(snesOptions('wasm', undefined).output).toBe('public/wasm');
    expect(snesOptions('wasm', { snes: { wasm: { output: 'apps/game/public/wasm' } } }).output).toBe('apps/game/public/wasm');
  });
});

describe('snes rom check against the workspace list', () => {
  const dirs = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  const romFile = () => {
    const dir = mkdtempSync(join(tmpdir(), 'snes-rom-'));
    dirs.push(dir);
    const file = join(dir, 'sample.sfc');
    writeFileSync(file, 'not a real rom');
    return file;
  };

  it('labels nothing by default and the listed hash when the workspace lists it', async () => {
    const file = romFile();
    const lines = [];
    const ctx = { log: (line) => lines.push(line), workspace: undefined };
    expect(await snes.run(['rom', 'check', file], {}, ctx)).toBe(1);
    const hash = lines[0].match(/([0-9A-F]{40})/)[1];
    const listed = { ...ctx, workspace: { snes: { roms: { sha1: { [hash]: 'sample-us' } } } } };
    expect(await snes.run(['rom', 'check', file], {}, listed)).toBe(0);
    expect(lines.at(-1)).toContain('(sample-us)');
  });
});

describe('snes launch flags', () => {
  const dirs = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  const worktreeWithSave = (workspace) => {
    const userData = mkdtempSync(join(tmpdir(), 'snes-states-'));
    dirs.push(userData);
    const manual = join(userData, 'Data/profiles/main/saves/normal');
    mkdirSync(manual, { recursive: true });
    writeFileSync(join(manual, 'manifest.json'), JSON.stringify([{ name: 'castle' }]));
    return { userData, name: 'main', workspace };
  };

  it('uses the plugin flags by default', () => {
    const tree = worktreeWithSave(undefined);
    expect(snes.saveStateOf(tree, 'none')).toEqual([]);
    expect(snes.saveStateOf(tree, 'game')).toEqual(['--start-game']);
    expect(snes.saveStateOf(tree, 'castle')).toEqual(['--load-state=castle']);
  });

  it('takes the app flags from the workspace', () => {
    const launchFlags = { game: ['--boot'], save: ['--boot', '--slot={state}'] };
    const tree = worktreeWithSave({ snes: { states: { launchFlags } } });
    expect(snes.saveStateOf(tree, 'game')).toEqual(['--boot']);
    expect(snes.saveStateOf(tree, 'castle')).toEqual(['--boot', '--slot=castle']);
  });

  it('refuses a save the profile does not have', () => {
    expect(snes.saveStateOf(worktreeWithSave(undefined), 'tower')).toMatch(/is not a save/);
  });
});
