/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { debControl } from '../src/packaging/server/deb-control.mjs';
import { fetchNodeBinary } from '../src/packaging/server/fetch-node.mjs';
import { tarGz } from '../src/packaging/server/tar-gz.mjs';
import { serverOptions } from '../src/platforms/server/server-options.mjs';
import { SERVER_NODE_SHA256, SERVER_NODE_VERSION } from '../src/platforms/server/server.constants.mjs';
import { CONFIG, PRODUCT, cleanup, fakeDownloads, managedFiles, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

const withPorts = (ports) => managedFiles({ ...CONFIG, server: { ports } })['build/server/fixture.service'];

describe('the unit hardening', () => {
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

describe('the system account', () => {
  const idProblem = (id) => () => serverOptions({ product: { ...PRODUCT, id } });

  it('rejects ids that name a system account', () => {
    for (const id of ['root', 'daemon', 'bin', 'sys', 'nobody', 'www-data', 'systemd-network', 'lxd', 'kvm', 'wheel', 'sudo', 'adm', 'docker', 'disk', 'shadow', 'staff', 'systemd-journal']) expect(idProblem(id)).toThrow(`product.id "${id}" is a system account name`);
  });

  it('rejects ids that cannot be an account name', () => {
    expect(idProblem('My_App')).toThrow('cannot name the server');
    expect(idProblem('1app')).toThrow('cannot name the server');
    expect(idProblem('a'.repeat(40))).toThrow('cannot name the server');
    expect(idProblem('rotp')).not.toThrow();
  });

  it('stops sync on a reserved id, since the unit and the scripts are rendered from it', () => {
    expect(() => managedFiles({ ...CONFIG, product: { ...PRODUCT, id: 'root' } })).toThrow('system account name');
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

  it('is valid shell', () => {
    const dir = tempDir();
    const file = join(dir, 'postinst');
    writeFileSync(file, managedFiles()['build/server/postinst']);
    const result = spawnSync('sh', ['-n', file], { encoding: 'utf8' });
    if (result.error) return;
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });
});

describe('the service on install and upgrade', () => {
  it('enables and starts only on a first install, and only try-restarts on an upgrade', () => {
    const postinst = managedFiles()['build/server/postinst'];
    expect(postinst).toContain('if [ -z "$2" ]; then\n      systemctl enable fixture.service\n      systemctl start fixture.service\n    else\n      systemctl try-restart fixture.service\n    fi');
    expect(postinst.match(/systemctl enable/g)).toHaveLength(1);
    expect(postinst).not.toMatch(/systemctl restart/);
  });
});

describe('the deb control fields', () => {
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

describe('the tar paths', () => {
  const entry = (path) => () => tarGz([{ path, mode: 0o644, data: 'x' }]);

  it('refuses an absolute path and a .. part', () => {
    expect(entry('/etc/passwd')).toThrow('absolute or has a ".." part');
    expect(entry('app/../../etc/passwd')).toThrow('absolute or has a ".." part');
    expect(entry('..')).toThrow('absolute or has a ".." part');
    expect(entry('app\\evil')).toThrow('absolute or has a ".." part');
    expect(entry('app/ok..name/file')).not.toThrow();
  });
});

describe('the pinned Node checksums', () => {
  it('pins an x64 and an arm64 archive for the default version', () => {
    expect(Object.keys(SERVER_NODE_SHA256[SERVER_NODE_VERSION]).sort()).toEqual(['arm64', 'x64']);
    for (const hash of Object.values(SERVER_NODE_SHA256[SERVER_NODE_VERSION])) expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('refuses an archive that differs from the pin even when SHASUMS256.txt is fine', async () => {
    const { download, pins } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    const swapped = { '24.1.0': { x64: 'f'.repeat(64) } };
    const sums = async (url) => (url.endsWith('SHASUMS256.txt') ? Buffer.from(`${'f'.repeat(64)}  node-v24.1.0-linux-x64.tar.gz\n`) : download(url));
    const cacheDir = tempDir();
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir, download: sums, pins: swapped })).rejects.toThrow('does not match the pinned sha256');
    expect(readdirSync(cacheDir)).toEqual([]);
    expect(pins['24.1.0'].x64).not.toBe(swapped['24.1.0'].x64);
  });

  it('says an unpinned version was checked against SHASUMS256.txt only, in the error and in the log', async () => {
    const { download } = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') }, { lie: true });
    await expect(fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir: tempDir(), download, pins: {} })).rejects.toThrow('does not match SHASUMS256.txt only (Node 24.1.0 has no pin in Brock)');
    const honest = fakeDownloads('24.1.0', { x64: Buffer.from('x64-node') });
    const lines = [];
    const log = vi.spyOn(console, 'log').mockImplementation((line) => lines.push(line));
    await fetchNodeBinary({ version: '24.1.0', arch: 'x64', cacheDir: tempDir(), download: honest.download, pins: {} });
    log.mockRestore();
    expect(lines).toEqual(['brock server package: Node 24.1.0 has no pin; node-v24.1.0-linux-x64.tar.gz was checked against SHASUMS256.txt only.']);
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
