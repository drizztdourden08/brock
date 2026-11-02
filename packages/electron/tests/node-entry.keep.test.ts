/* @layer electron-main @kind test */
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';

let root = '';

afterEach(async () => {
  if (root) await rm(root, { recursive: true, force: true });
  root = '';
});

describe('K2 the Electron-free entry, @drizztdourden08/brock-electron/node', { tags: ['critical'] }, () => {
  it('serves data domains from a folder the caller passes, with atomic writes, path guards and sizes', async () => {
    const node = await import('../src/node');
    root = await mkdtemp(join(tmpdir(), 'brock-node-domains-'));
    const domains = node.createDataDomains(root, [{ domain: 'lobby', label: 'Lobby', dir: 'lobby/rooms' }]);
    const lobby = domains.domain('lobby');
    expect(lobby.dir()).toBe(join(root, 'lobby', 'rooms'));
    await lobby.writeJson('a/one.json', { seat: 2 });
    expect(await lobby.readJson('a/one.json', null)).toEqual({ seat: 2 });
    expect(await lobby.size('a/one.json')).toBeGreaterThan(0);
    expect((await domains.usage('lobby')).bytes).toBeGreaterThan(0);
    await expect(lobby.writeText('../escape.txt', 'x')).rejects.toThrow();
    expect(() => domains.domain('missing')).toThrow(/unknown data domain/);
    expect(() => node.createDataDomains(root, [{ domain: 'a', label: 'A', dir: '../out' }])).toThrow();
  });

  it('serves the data paths and the JSON helpers under a folder a test picks', async () => {
    const node = await import('../src/node');
    root = await mkdtemp(join(tmpdir(), 'brock-node-'));
    node.initPaths(root);
    expect(node.getUserDataPath('saves', 'a.json')).toBe(join(root, 'Data', 'saves', 'a.json'));
    expect(node.getLegacyPath('x')).toBe(join(root, 'x'));
    await node.ensureDataDirectories(['saves']);
    await node.writeJsonFile(node.getUserDataPath('saves', 'a.json'), { slot: 1 });
    expect(await node.readJsonFile(node.getUserDataPath('saves', 'a.json'), null)).toEqual({ slot: 1 });
    expect(await node.readJsonFile(node.getUserDataPath('saves', 'missing.json'), 'fallback')).toBe('fallback');
    expect(() => node.resolveDataPath('../escape')).toThrow(/escapes/);
    expect(await node.createNodeFileStore().readText('saves/a.json')).toContain('"slot": 1');
  });
});
