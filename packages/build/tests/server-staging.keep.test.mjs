/* @layer tooling-scripts @kind test */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { debControl, debVersion } from '../src/packaging/server/deb-control.mjs';
import { fetchNodeBinary } from '../src/packaging/server/fetch-node.mjs';
import { readTarGzEntry } from '../src/packaging/server/read-tar-gz-entry.mjs';
import { stageServer } from '../src/packaging/server/stage-server.mjs';
import { tarGz } from '../src/packaging/server/tar-gz.mjs';
import { PRODUCT, appFolder, cleanup, fakeDownloads, listTar, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

describe('the pinned Node binary', () => {
  it('takes bin/node out of the official tarball once its sha256 matches SHASUMS256.txt', async () => {
    const { download, calls } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    const binary = await fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir: tempDir(), download });
    expect(binary.toString()).toBe('x64-node');
    expect(calls).toEqual(['https://nodejs.org/dist/v24.1.0/SHASUMS256.txt', 'https://nodejs.org/dist/v24.1.0/node-v24.1.0-linux-x64.tar.gz']);
  });

  it('refuses a tarball that does not match its checksum and caches nothing', async () => {
    const { download } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') }, { lie: true });
    const cacheDir = tempDir();
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download })).rejects.toThrow('does not match SHASUMS256.txt');
    expect(readdirSync(cacheDir)).toEqual([]);
  });

  it('refuses a version that SHASUMS256.txt does not list', async () => {
    const { download } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'arm64', cacheDir: tempDir(), download })).rejects.toThrow('does not list node-v24.1.0-linux-arm64.tar.gz');
  });

  it('reuses a verified cache without the network, and fetches again when the cached file changed', async () => {
    const { download, calls } = fakeDownloads('24.1.0', { arm64: Buffer.from('arm-node') });
    const cacheDir = tempDir();
    await fetchNodeBinary({ version: '24.1.0', arch: 'arm64', cacheDir, download });
    calls.length = 0;
    expect((await fetchNodeBinary({ version: '24.1.0', arch: 'arm64', cacheDir, download })).toString()).toBe('arm-node');
    expect(calls).toEqual([]);
    writeFileSync(join(cacheDir, 'node-v24.1.0-linux-arm64.tar.gz'), 'tampered');
    expect((await fetchNodeBinary({ version: '24.1.0', arch: 'arm64', cacheDir, download })).toString()).toBe('arm-node');
    expect(calls).toHaveLength(2);
  });
});

describe('the tarball writer', () => {
  it('writes valid ustar headers owned by root, with the directories first and the modes kept', () => {
    const rows = listTar(tarGz([
      { path: 'app/bin/app-server', mode: 0o755, data: '#!/bin/sh\n' },
      { path: 'app/server/main.mjs', mode: 0o644, data: 'x'.repeat(700) },
    ]));
    expect(rows.map(({ name, mode, type, size }) => [name, mode, type, size])).toEqual([
      ['app/', 0o755, '5', 0],
      ['app/bin/', 0o755, '5', 0],
      ['app/server/', 0o755, '5', 0],
      ['app/bin/app-server', 0o755, '0', 10],
      ['app/server/main.mjs', 0o644, '0', 700],
    ]);
    expect(rows.every((row) => row.valid && row.owner === 'root')).toBe(true);
  });

  it('gives the same bytes for the same input and finds an entry back', () => {
    const entries = [{ path: 'a/b.txt', mode: 0o644, data: 'hello' }];
    expect(tarGz(entries).equals(tarGz(entries))).toBe(true);
    expect(readTarGzEntry(tarGz(entries), (name) => name === 'a/b.txt').toString()).toBe('hello');
    expect(readTarGzEntry(tarGz(entries), (name) => name === 'a/missing')).toBeNull();
  });

  it('splits a long path into prefix and name, and refuses one that cannot be split', () => {
    const long = `${'folder/'.repeat(20)}file.txt`;
    expect(readTarGzEntry(tarGz([{ path: long, mode: 0o644, data: 'deep' }]), (name) => name === long).toString()).toBe('deep');
    expect(() => tarGz([{ path: 'x'.repeat(300), mode: 0o644, data: '' }])).toThrow('too long');
  });
});

describe('the staged tree', () => {
  it('holds the launcher, the node binary and the bundle under <id>/', () => {
    const entries = stageServer({ rootDir: appFolder(), id: 'fixture', node: Buffer.from('node') });
    expect(entries.map(({ path, mode }) => [path, mode])).toEqual([
      ['fixture/bin/fixture-server', 0o755],
      ['fixture/node/bin/node', 0o755],
      ['fixture/server/main.mjs', 0o644],
    ]);
    expect(entries[0].data).toContain('exec "$here/../node/bin/node" "$here/../server/main.mjs" "$@"');
    expect(entries[2].data.toString()).toBe('export const server = true;\n');
  });

  it('asks for a build when the bundle is missing', () => {
    expect(() => stageServer({ rootDir: tempDir(), id: 'fixture', node: Buffer.from('node') })).toThrow('run brock server build first');
  });
});

describe('the deb control file', () => {
  const spec = { id: 'fixture', version: '1.4.0', arch: 'amd64', product: PRODUCT, osPackages: ['bubblewrap', 'libssl3'], installedSizeKib: 123 };

  it('names the package, the version, the architecture, the maintainer and the dependencies', () => {
    expect(debControl(spec)).toBe([
      'Package: fixture-server',
      'Version: 1.4.0',
      'Architecture: amd64',
      'Maintainer: Dev Person <dev@example.com>',
      'Installed-Size: 123',
      'Depends: bubblewrap, libssl3',
      'Section: misc',
      'Priority: optional',
      'Description: A fixture server',
      '',
    ].join('\n'));
  });

  it('leaves Depends out without OS packages, falls back for the description and the email, and sorts a prerelease first', () => {
    const bare = debControl({ ...spec, osPackages: [], version: '2.0.0-beta.1', product: { ...PRODUCT, description: undefined, author: { name: 'Dev' } } });
    expect(bare).not.toContain('Depends');
    expect(bare).toContain('Version: 2.0.0~beta.1');
    expect(bare).toContain('Maintainer: Dev <noreply@localhost>');
    expect(bare).toContain('Description: Fixture App server');
    expect(debVersion('1.0.0+build.5')).toBe('1.0.0.build.5');
  });
});
