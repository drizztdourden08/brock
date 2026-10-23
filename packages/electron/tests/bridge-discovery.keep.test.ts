/* @layer electron-main @kind test */
import { spawnSync } from 'child_process';
import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bridgeDiscoveryFile, readBridgeDiscovery } from '../src/bridge';
import type { PathStat } from '../src/main/bridge/bridge.type';
import { bridgeKeyOf } from '../src/main/bridge/bridge-key';
import { checkSocketFolder } from '../src/main/bridge/check-socket-folder';
import { clearStaleDiscovery } from '../src/main/bridge/clear-stale-discovery';
import { createLineReader } from '../src/main/bridge/line-reader';
import { isLocalEndpoint } from '../src/main/bridge/is-local-endpoint';
import { isProcessAlive } from '../src/main/bridge/is-process-alive';
import { removeDiscovery } from '../src/main/bridge/remove-discovery';
import { ROUTES, client, closeOpened, discoveryFor, discoveryOf, serve, tempDir, writeOpenFile } from './bridge-fixture';

afterEach(() => {
  vi.restoreAllMocks();
  closeOpened();
});

const deadPid = (): number => spawnSync(process.execPath, ['-e', '']).pid;

const stat = (kind: 'dir' | 'link' | 'socket', uid: number, mode: number): PathStat => ({
  isSymbolicLink: () => kind === 'link',
  isDirectory: () => kind === 'dir',
  isSocket: () => kind === 'socket',
  uid,
  mode,
});

describe('the bridge discovery file', () => {
  it('opens a local pipe or a private socket, never a TCP port', async () => {
    const { server } = await serve();
    if (process.platform !== 'win32') expect(statSync(server.endpoint).mode & 0o777).toBe(0o600);
    expect(isLocalEndpoint(server.endpoint)).toBe(true);
    expect(isLocalEndpoint(`\\\\otherhost\\pipe\\brock-x-${'a'.repeat(32)}`, 'win32')).toBe(false);
    expect(isLocalEndpoint('\\\\.\\pipe\\some-other-pipe', 'win32')).toBe(false);
    expect(isLocalEndpoint('127.0.0.1:4000', 'linux')).toBe(false);
  });

  it('is private to the user and removed only by its own session', async () => {
    const { server, file } = await serve();
    expect(readBridgeDiscovery(file).endpoint).toBe(server.endpoint);
    expect(removeDiscovery(file, 'another session')).toBe(false);
    expect(removeDiscovery(file, server.secret)).toBe(true);
    expect(existsSync(file)).toBe(false);
    await expect(client(file).request(ROUTES.add, 1, 1)).rejects.toThrow('is missing');
  });

  it('refuses a discovery file other accounts can read', async () => {
    const { server } = await serve();
    const open = join(tempDir(), 'bridge.json');
    writeOpenFile(open, JSON.stringify(discoveryOf(server)));
    expect(() => readBridgeDiscovery(open)).toThrow(/open to other/);
  });

});

describe('stale and forged discovery files', () => {
  it('counts a process it may not signal as gone, and refuses its file', async () => {
    const { server } = await serve();
    const stale = discoveryFor(server, deadPid());
    await expect(client(stale).request(ROUTES.add, 1, 1)).rejects.toThrow('left from a session that ended');
    vi.spyOn(process, 'kill').mockImplementation(() => {
      throw Object.assign(new Error('operation not permitted'), { code: 'EPERM' });
    });
    expect(isProcessAlive(12345)).toBe(false);
  });

  it('clears a stale file at start and keeps one a live app holds', async () => {
    const { server } = await serve();
    const stale = discoveryFor(server, deadPid());
    expect(clearStaleDiscovery(stale)).toBe(true);
    expect(existsSync(stale)).toBe(false);
    const live = discoveryFor(server, process.ppid);
    expect(clearStaleDiscovery(live)).toBe(false);
    expect(existsSync(live)).toBe(true);
  });

  it('refuses a socket folder that is not a private folder of the user', () => {
    const sock = '/tmp/brock-x/bridge.sock';
    const lstatOf = (folder: PathStat, socket: PathStat) => (path: string): PathStat => (path === sock ? socket : folder);
    const good = stat('socket', 501, 0o140600);
    expect(() => checkSocketFolder(sock, 501, lstatOf(stat('dir', 501, 0o40700), good))).not.toThrow();
    expect(() => checkSocketFolder(sock, 501, lstatOf(stat('link', 501, 0o120777), good))).toThrow('not a private folder');
    expect(() => checkSocketFolder(sock, 501, lstatOf(stat('dir', 501, 0o40755), good))).toThrow('not a private folder');
    expect(() => checkSocketFolder(sock, 501, lstatOf(stat('dir', 777, 0o40700), good))).toThrow('not a private folder');
    expect(() => checkSocketFolder(sock, 501, lstatOf(stat('dir', 501, 0o40700), stat('socket', 777, 0o140600)))).toThrow('not a socket of this user');
  });

});

describe('the bridge discovery paths', () => {
  it('lives in the per-user app data folder, keyed by app and instance', () => {
    expect(bridgeDiscoveryFile('bxel', null, { env: { APPDATA: 'C:\\Users\\u\\AppData\\Roaming' }, platform: 'win32', home: 'C:\\Users\\u' }))
      .toBe(join('C:\\Users\\u\\AppData\\Roaming', 'bxel', 'bridge.json'));
    expect(bridgeDiscoveryFile('bxel', 'Second', { env: {}, platform: 'linux', home: '/home/u' })).toBe(join('/home/u', '.config', 'bxel', 'bridge.second.json'));
    expect(bridgeDiscoveryFile('bxel', null, { env: {}, platform: 'darwin', home: '/Users/u' })).toBe(join('/Users/u', 'Library', 'Application Support', 'bxel', 'bridge.json'));
    expect(bridgeKeyOf(null, null)).toBeNull();
    expect(bridgeKeyOf('second', '/tmp/data')).toBe('second');
    expect(bridgeKeyOf(null, '/tmp/data')).toMatch(/^data-[0-9a-f]{12}$/);
  });

  it('reads lines split across chunks and stops at the limit', () => {
    const lines: string[] = [];
    const overflow = vi.fn();
    const read = createLineReader(8, (line) => lines.push(line), overflow);
    read(Buffer.from('ab'));
    read(Buffer.from('c\nde\n\nf'));
    read(Buffer.from('g\n'));
    expect(lines).toEqual(['abc', 'de', 'fg']);
    read(Buffer.from('123456789'));
    expect(overflow).toHaveBeenCalledTimes(1);
    read(Buffer.from('\nlater\n'));
    expect(lines).toEqual(['abc', 'de', 'fg']);
  });
});
