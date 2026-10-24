/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pinApp } from '../src/upgrade/index.mjs';

const CORE = '@drizztdourden08/brock-core';
const TESSERA = '@drizztdourden08/tessera';

const dirs: string[] = [];

const appWith = (pkg: object): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-pin-'));
  dirs.push(root);
  writeFileSync(join(root, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
  return root;
};

const read = (root: string): { brock?: { version: string }, dependencies: Record<string, string> } =>
  JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { brock?: { version: string }, dependencies: Record<string, string> };

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('pinApp', () => {
  it('adds brock.version from the installed build when it is absent', () => {
    const root = appWith({ dependencies: { [CORE]: '^0.1.0' } });
    expect(pinApp(root, '0.1.0', false)).toEqual(['brock.version']);
    expect(read(root).brock?.version).toBe('0.1.0');
  });

  it('moves every Brock package to the pin and leaves the rest alone', () => {
    const root = appWith({ brock: { version: '0.2.0' }, dependencies: { [CORE]: '^0.1.0', [TESSERA]: '^1.0.0' } });
    expect(pinApp(root, '0.1.0', false)).toEqual([`dependencies.${CORE}`]);
    expect(read(root).dependencies).toEqual({ [CORE]: '^0.2.0', [TESSERA]: '^1.0.0' });
  });

  it('keeps link specs in local mode', () => {
    const root = appWith({ dependencies: { [CORE]: 'link:X:/brock/packages/core' } });
    expect(pinApp(root, '0.1.0', false)).toEqual(['brock.version']);
    expect(read(root).dependencies[CORE]).toBe('link:X:/brock/packages/core');
  });

  it('leaves a workspace member without a pin', () => {
    const root = appWith({ dependencies: { [CORE]: 'workspace:*' } });
    expect(pinApp(root, '0.1.0', false)).toEqual([]);
    expect(read(root).brock).toBeUndefined();
  });

  it('reports without writing in check mode', () => {
    const root = appWith({ dependencies: { [CORE]: '^0.1.0' } });
    expect(pinApp(root, '0.1.0', true)).toEqual(['brock.version']);
    expect(read(root).brock).toBeUndefined();
  });

  it('names the old range, the new range and the pin that drives it, once per package', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const root = appWith({ brock: { version: '0.1.0' }, dependencies: { [CORE]: '^0.2.0', [TESSERA]: '^1.0.0' } });
    expect(pinApp(root, '0.1.0', false)).toEqual([`dependencies.${CORE}`]);
    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0]?.[0]);
    expect(message).toContain(`dependencies.${CORE}`);
    expect(message).toContain('^0.2.0');
    expect(message).toContain('^0.1.0');
    expect(message).toContain('brock.version');
    expect(message).toContain('brock upgrade 0.2.0');
    warn.mockRestore();
  });

  it('says would change in check mode and stays silent when nothing differs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    pinApp(appWith({ brock: { version: '0.1.0' }, dependencies: { [CORE]: '^0.2.0' } }), '0.1.0', true);
    expect(String(warn.mock.calls[0]?.[0])).toContain('would change');
    warn.mockClear();
    pinApp(appWith({ brock: { version: '0.1.0' }, dependencies: { [CORE]: '^0.1.0' } }), '0.1.0', false);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
