/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { launcherSource, runThreadCli } from '../src/index.mjs';
import { runThreadBin } from '../src/cli/run-thread-cli.mjs';

const folders = [];

const scratch = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-link-'));
  folders.push(root);
  Object.entries(files).forEach(([path, content]) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  });
  return root;
};

const repo = (pkg, files = {}) => scratch({ 'package.json': JSON.stringify(pkg), 'brock.workspace.mjs': "export default { name: 'lib' };\n", ...files });

afterEach(() => {
  vi.restoreAllMocks();
  folders.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

const packageOf = (root) => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

describe('brock-thread link', () => {
  it('writes the launcher, the bin entry and the postinstall for a repo with no command', async () => {
    const root = repo({ name: '@scope/library' });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(await runThreadCli(['link'], root)).toBe(0);
    expect(readFileSync(join(root, 'bin/lib.mjs'), 'utf8')).toBe(launcherSource('lib'));
    expect(packageOf(root).bin).toEqual({ lib: './bin/lib.mjs' });
    expect(packageOf(root).scripts.postinstall).toBe('node bin/lib.mjs --link');
  });

  it('changes nothing on a second run', async () => {
    const root = repo({ name: 'library' });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runThreadCli(['link'], root);
    const before = readFileSync(join(root, 'package.json'), 'utf8');
    expect(await runThreadCli(['link'], root)).toBe(0);
    expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(before);
    expect(log).toHaveBeenLastCalledWith('lib: the launcher is already in place');
  });

  it('leaves a command the package already has alone and accepts it once it forwards', async () => {
    const root = repo({ name: 'lib', bin: { lib: './scripts/cli/lib.mjs' } }, { 'scripts/cli/lib.mjs': "import { runThreadCli } from '@drizztdourden08/brock-thread/cli';\n" });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(await runThreadCli(['link'], root)).toBe(0);
    expect(log).toHaveBeenCalledWith('lib: scripts/cli/lib.mjs already forwards the thread verbs');
    expect(packageOf(root)).toEqual({ name: 'lib', bin: { lib: './scripts/cli/lib.mjs' } });
  });

  it('names the forwarding lines when the command does not forward yet', async () => {
    const root = repo({ name: 'lib', bin: 'scripts/lib.mjs' }, { 'scripts/lib.mjs': 'export {};\n' });
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await runThreadCli(['link'], root)).toBe(1);
    expect(error.mock.calls[0][0]).toContain('runThreadCli');
    expect(packageOf(root).scripts).toBeUndefined();
  });

  it('stops where there is no brock.workspace.mjs', async () => {
    const root = scratch({ 'package.json': '{}' });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await runThreadCli(['link'], root)).toBe(1);
  });
});

describe('runThreadCli', () => {
  it('returns null for a word that is not a thread word, so the host handles it', async () => {
    expect(await runThreadCli(['check'])).toBeNull();
    expect(await runThreadCli([])).toBeNull();
  });

  it('prints the usage for an unknown word in the brock-thread bin', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await runThreadBin(['nope'])).toBe(1);
    expect(error.mock.calls[0][0]).toContain('brock-thread link');
  });
});
