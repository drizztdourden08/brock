/* @layer tooling-scripts @kind test */
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { debControl } from '../src/packaging/server/deb-control.mjs';
import { fetchNodeBinary } from '../src/packaging/server/fetch-node.mjs';
import { tarGz } from '../src/packaging/server/tar-gz.mjs';
import { serverOptions } from '../src/platforms/server/server-options.mjs';
import { CONFIG, PRODUCT, cleanup, fakeDownloads, managedFiles, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

const withPorts = (ports) => managedFiles({ ...CONFIG, server: { ports } })['build/server/fixture.service'];

describe('K4 the unit hardening', { tags: ['critical'] }, () => {
  it('sets the sandbox lines and the state folder mode', () => {
    const unit = withPorts([8080]);
    for (const line of ['NoNewPrivileges=yes', 'ProtectSystem=strict', 'ProtectHome=yes', 'PrivateDevices=yes', 'PrivateTmp=yes', 'StateDirectoryMode=0750', 'UMask=0027']) {
      expect(unit.split('\n')).toContain(line);
    }
    expect(unit).toContain('StateDirectory=fixture\n');
  });

  it('grants CAP_NET_BIND_SERVICE only when a port is below 1024', () => {
    expect(withPorts([8080, 38290])).not.toContain('AmbientCapabilities');
    expect(withPorts([])).not.toContain('AmbientCapabilities');
    expect(withPorts([8080, 443]).split('\n')).toContain('AmbientCapabilities=CAP_NET_BIND_SERVICE');
    expect(withPorts([1023]).split('\n')).toContain('AmbientCapabilities=CAP_NET_BIND_SERVICE');
    expect(withPorts([1024])).not.toContain('AmbientCapabilities');
  });
});

describe('K4 the system account', { tags: ['critical'] }, () => {
  const idProblem = (id) => () => serverOptions({ product: { ...PRODUCT, id } });

  it('rejects ids that name a system account', () => {
    for (const id of ['root', 'nobody', 'www-data', 'systemd-network', 'docker']) expect(idProblem(id)).toThrow(`product.id "${id}" is a system account name`);
  });

  it('rejects ids that cannot be an account name', () => {
    expect(idProblem('My_App')).toThrow('cannot name the server');
    expect(idProblem('1app')).toThrow('cannot name the server');
    expect(idProblem('a'.repeat(40))).toThrow('cannot name the server');
    expect(idProblem('rotp')).not.toThrow();
  });

  it('makes postinst refuse an existing account that is not the package user', () => {
    const postinst = managedFiles()['build/server/postinst'];
    expect(postinst).toContain('if entry=$(getent passwd fixture); then');
    expect(postinst).toContain('[ "$uid" -lt 100 ] || [ "$uid" -gt 999 ]');
    expect(postinst).toContain('[ "$shell" != "/usr/sbin/nologin" ]');
    expect(postinst).toContain('[ "$comment" != "fixture server (brock)" ]');
    expect(postinst).toMatch(/was not made by this package[^\n]*>&2\n\s+exit 1/);
  });

  it('adopts an existing group of the same name only when it is a plain system group', () => {
    const postinst = managedFiles()['build/server/postinst'];
    expect(postinst).toContain('if group_entry=$(getent group fixture); then');
    expect(postinst).toContain('[ "$gid" -lt 100 ] || [ "$gid" -gt 999 ] || [ -n "$members" ]');
    expect(postinst).toMatch(/not a plain system group[^\n]*>&2\n\s+exit 1/);
    expect(postinst).toContain('group_option="-g fixture"');
    expect(postinst).toContain('group_option="--user-group"');
  });
});

describe('K4 the deb control fields', { tags: ['critical'] }, () => {
  const spec = { id: 'fixture', version: '1.4.0', arch: 'amd64', product: PRODUCT, osPackages: [], installedSizeKib: 1 };
  const withAuthor = (author) => () => debControl({ ...spec, product: { ...PRODUCT, author } });

  it('keeps a plain address and refuses one that would add a field or break the line', () => {
    expect(withAuthor({ name: 'Dev', email: 'dev+ci@example.com' })).not.toThrow();
    expect(withAuthor({ name: 'Dev', email: 'dev@example.com\nDepends: evil' })).toThrow('is not a plain address');
    expect(withAuthor({ name: 'Dev', email: 'Dev <dev@example.com>' })).toThrow('is not a plain address');
    expect(withAuthor({ name: 'Dev <x>' })).toThrow('cannot be a Debian maintainer name');
  });

  it('refuses a version Debian cannot read', () => {
    expect(() => debControl({ ...spec, version: '1.0.0\nDepends: evil' })).toThrow('cannot be a Debian version');
    expect(() => debControl({ ...spec, version: 'v1.0' })).toThrow('cannot be a Debian version');
    expect(() => debControl({ ...spec, version: '1.0.0-rc.1' })).not.toThrow();
  });
});

describe('K4 the tar paths', { tags: ['critical'] }, () => {
  const entry = (path) => () => tarGz([{ path, mode: 0o644, data: 'x' }]);

  it('refuses an absolute path and a .. part', () => {
    expect(entry('/etc/passwd')).toThrow('absolute or has a ".." part');
    expect(entry('app/../../etc/passwd')).toThrow('absolute or has a ".." part');
    expect(entry('..')).toThrow('absolute or has a ".." part');
    expect(entry('app\\evil')).toThrow('absolute or has a ".." part');
    expect(entry('app/ok..name/file')).not.toThrow();
  });
});

describe('K4 the pinned Node checksums', { tags: ['critical'] }, () => {
  it('refuses an archive that differs from the pin even when SHASUMS256.txt is fine', async () => {
    const { download, pins } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    const swapped = { '24.1.0': { x64: 'f'.repeat(64) } };
    const sums = async (url) => (url.endsWith('SHASUMS256.txt') ? Buffer.from(`${'f'.repeat(64)}  node-v24.1.0-linux-x64.tar.gz\n`) : download(url));
    const cacheDir = tempDir();
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download: sums, pins: swapped })).rejects.toThrow('does not match the pinned sha256');
    expect(readdirSync(cacheDir)).toEqual([]);
    expect(pins['24.1.0'].x64).not.toBe(swapped['24.1.0'].x64);
  });

  it('refuses when SHASUMS256.txt disagrees with the pin', async () => {
    const { download, pins } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') }, { lie: true });
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir: tempDir(), download, pins })).rejects.toThrow('but Brock pins');
  });

  it('accepts an archive that matches the pin, and drops a cached file that does not', async () => {
    const { download, calls, pins } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    const cacheDir = tempDir();
    expect((await fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download, pins })).toString()).toBe('x64-node');
    calls.length = 0;
    await fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download, pins });
    expect(calls).toEqual([]);
    writeFileSync(join(cacheDir, 'node-v24.1.0-linux-x64.tar.gz.sha256'), `${'0'.repeat(64)}\n`);
    await fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download, pins });
    expect(calls).toHaveLength(2);
  });
});
