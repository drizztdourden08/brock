/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { packageServer } from '../src/packaging/server/package-server.mjs';
import { readTarGzEntry } from '../src/packaging/server/read-tar-gz-entry.mjs';
import { SERVER_NODE_VERSION } from '../src/platforms/server/server.constants.mjs';
import { BINARIES, CONFIG, NO_DPKG, PRODUCT, appFolder, cleanup, fakeDownloads, listTar, put, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

const pack = (root, extra = {}, deps = {}) => {
  const { download, pins } = fakeDownloads(extra.node ?? SERVER_NODE_VERSION, BINARIES, extra);
  return packageServer({ rootDir: root, config: extra.config ?? CONFIG, arches: extra.arches, deb: extra.deb, deps: { download, pins, cacheDir: tempDir(), dpkg: NO_DPKG, ...deps } });
};

const dpkgMock = (calls) => ({
  available: () => true,
  run: (args) => {
    const tree = args[2];
    calls.push({
      args,
      files: readdirSync(tree, { recursive: true }).map((name) => String(name).replace(/\\/g, '/')).sort(),
      control: readFileSync(join(tree, 'DEBIAN/control'), 'utf8'),
      postinst: readFileSync(join(tree, 'DEBIAN/postinst'), 'utf8'),
      wrapper: readFileSync(join(tree, 'usr/bin/fixture-server'), 'utf8'),
    });
    return { ok: true, out: '' };
  },
});

describe('brock server package: the tarball and the Docker context', () => {
  it('writes a tarball and the Docker context for x64 by default, with no deb', async () => {
    const root = appFolder();
    const result = await pack(root);
    const out = join(root, 'release/server');
    expect(readdirSync(out).sort()).toEqual(['docker', 'fixture-server-linux-x64.tar.gz']);
    expect(result.tarballs).toEqual([join(out, 'fixture-server-linux-x64.tar.gz')]);
    expect(result.debs).toEqual([]);
    expect(result.image).toBe('ghcr.io/owner/fixture-server');
    expect(readdirSync(join(out, 'docker')).sort()).toEqual(['Dockerfile', 'bundle-amd64.tar.gz']);
    const tarball = readFileSync(join(out, 'fixture-server-linux-x64.tar.gz'));
    expect(readFileSync(join(out, 'docker/bundle-amd64.tar.gz')).equals(tarball)).toBe(true);
    expect(readFileSync(join(out, 'docker/Dockerfile'), 'utf8')).toBe(readFileSync(join(root, 'build/server/Dockerfile'), 'utf8'));
    expect(listTar(tarball).filter((row) => row.type === '0').map((row) => [row.name, row.mode])).toEqual([
      ['fixture/bin/fixture-server', 0o755],
      ['fixture/node/bin/node', 0o755],
      ['fixture/server/main.mjs', 0o644],
    ]);
    expect(readTarGzEntry(tarball, (name) => name === 'fixture/node/bin/node').toString()).toBe('x64-node');
  });

  it('uses server.arch when --arch is not given, and --arch over it', async () => {
    const config = { ...CONFIG, server: { ...CONFIG.server, arch: ['arm64'] } };
    const fromConfig = await pack(appFolder(), { config });
    expect(fromConfig.tarballs.map((file) => file.split(/[\\/]/).pop())).toEqual(['fixture-server-linux-arm64.tar.gz']);
    const fromFlag = await pack(appFolder(), { config, arches: ['x64'] });
    expect(fromFlag.tarballs.map((file) => file.split(/[\\/]/).pop())).toEqual(['fixture-server-linux-x64.tar.gz']);
  });

  it('honours artifactPrefix and server.node', async () => {
    const config = { ...CONFIG, product: { ...PRODUCT, artifactPrefix: 'fx_' }, server: { node: '24.9.0' } };
    const { download, calls } = fakeDownloads('24.9.0', BINARIES);
    const result = await packageServer({ rootDir: appFolder(), config, deps: { download, cacheDir: tempDir(), dpkg: NO_DPKG } });
    expect(result.tarballs[0].endsWith('fx_server-linux-x64.tar.gz')).toBe(true);
    expect(calls[0]).toBe('https://nodejs.org/dist/v24.9.0/SHASUMS256.txt');
  });
});

describe('brock server package: the deb and the refusals', () => {
  it('builds both architectures with the version in the names and a deb per arch', async () => {
    const root = appFolder();
    const calls = [];
    const result = await pack(root, { arches: ['x64', 'arm64'], deb: true }, { dpkg: dpkgMock(calls) });
    const out = join(root, 'release/server');
    expect(readdirSync(out).sort()).toEqual(['docker', 'fixture-server-linux-arm64.tar.gz', 'fixture-server-linux-x64.tar.gz']);
    expect(readdirSync(join(out, 'docker')).sort()).toEqual(['Dockerfile', 'bundle-amd64.tar.gz', 'bundle-arm64.tar.gz']);
    expect(result.debs).toEqual([join(out, 'fixture-server_1.4.0_amd64.deb'), join(out, 'fixture-server_1.4.0_arm64.deb')]);
    expect(calls.map((call) => [call.args[0], call.args[1], call.args[3]])).toEqual([
      ['--root-owner-group', '--build', join(out, 'fixture-server_1.4.0_amd64.deb')],
      ['--root-owner-group', '--build', join(out, 'fixture-server_1.4.0_arm64.deb')],
    ]);
    expect(calls[1].control).toContain('Architecture: arm64');
    expect(calls[0].control).toContain('Package: fixture-server\nVersion: 1.4.0\nArchitecture: amd64\n');
    expect(calls[0].control).toContain('Depends: bubblewrap, libssl3\n');
    expect(calls[0].postinst).toBe(readFileSync(join(root, 'build/server/postinst'), 'utf8'));
    expect(calls[0].wrapper).toBe('#!/bin/sh\nexec /opt/fixture/bin/fixture-server "$@"\n');
    expect(existsSync(join(out, 'deb-x64'))).toBe(false);
  });

  it('lays out /opt, the unit, the wrapper and the maintainer scripts in the deb tree', async () => {
    const calls = [];
    await pack(appFolder(), { deb: true }, { dpkg: dpkgMock(calls) });
    expect(calls[0].files).toEqual([
      'DEBIAN', 'DEBIAN/control', 'DEBIAN/postinst', 'DEBIAN/prerm', 'opt', 'opt/fixture', 'opt/fixture/bin', 'opt/fixture/bin/fixture-server',
      'opt/fixture/node', 'opt/fixture/node/bin', 'opt/fixture/node/bin/node', 'opt/fixture/server', 'opt/fixture/server/main.mjs',
      'usr', 'usr/bin', 'usr/bin/fixture-server', 'usr/lib', 'usr/lib/systemd', 'usr/lib/systemd/system', 'usr/lib/systemd/system/fixture.service',
    ]);
  });

  it('refuses --deb without dpkg-deb before it fetches anything', async () => {
    const root = appFolder();
    const calls = [];
    const download = async (url) => {
      calls.push(url);
      return Buffer.alloc(0);
    };
    await expect(packageServer({ rootDir: root, config: CONFIG, deb: true, deps: { download, cacheDir: tempDir(), dpkg: NO_DPKG } })).rejects.toThrow('needs dpkg-deb');
    expect(calls).toEqual([]);
    expect(existsSync(join(root, 'release'))).toBe(false);
  });

  it('stops when SHASUMS256.txt disagrees with the pin and writes no tarball', async () => {
    const root = appFolder();
    await expect(pack(root, { lie: true })).rejects.toThrow('but Brock pins');
    expect(readdirSync(join(root, 'release/server'))).toEqual([]);
  });

  it('asks for brock sync when a managed file is missing', async () => {
    const bare = tempDir();
    put(bare, 'package.json', JSON.stringify({ version: '1.0.0' }));
    put(bare, 'dist/server/main.mjs', 'x');
    await expect(pack(bare)).rejects.toThrow('build/server/Dockerfile is missing; run brock sync.');
  });
});
