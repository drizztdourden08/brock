/* @layer tooling-scripts @kind test */
import { existsSync, mkdtempSync,readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { crossDriveLinks } from '../src/links/cross-drive-links.mjs';
import { keepCrossDriveLinks } from '../src/links/keep-cross-drive-links.mjs';
import { linkSpec } from '../src/links/link-spec.mjs';

const CORE = '@drizztdourden08/brock-core';
const BUILD = '@drizztdourden08/brock-build';

describe('linkSpec', () => {
  it('writes an absolute path with forward slashes', () => {
    const spec = linkSpec(join('checkout', 'packages', 'core'));
    expect(spec).toBe(`link:${resolve('checkout/packages/core').replace(/\\/g, '/')}`);
    expect(spec).not.toContain('\\');
  });
});

describe('crossDriveLinks', () => {
  it('names the links on another drive, whatever the letter case', () => {
    const pkg = { dependencies: { [CORE]: 'link:X:/brock/packages/core' }, devDependencies: { [BUILD]: 'link:x:\\brock\\packages\\build' } };
    expect(crossDriveLinks(pkg, 'C:\\bl\\app')).toEqual([CORE, BUILD]);
  });

  it('leaves same-drive, relative and registry specs alone', () => {
    const pkg = { dependencies: { [CORE]: 'link:c:/brock/packages/core', a: 'link:../a', b: '^1.0.0', c: 'workspace:*' } };
    expect(crossDriveLinks(pkg, 'C:\\bl\\app')).toEqual([]);
  });

  it('finds nothing outside Windows paths', () => {
    expect(crossDriveLinks({ dependencies: { [CORE]: 'link:/home/me/brock/packages/core' } }, '/home/me/app')).toEqual([]);
  });
});

describe('keepCrossDriveLinks', () => {
  let dir = '';
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const appWith = (dependencies, npmrc) => {
    dir = mkdtempSync(join(tmpdir(), 'brock-links-'));
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ dependencies }), 'utf8');
    if (npmrc !== undefined) writeFileSync(join(dir, '.npmrc'), npmrc, 'utf8');
    return dir;
  };
  const otherDrive = () => (/^[Zz]:/.test(tmpdir()) ? 'Y' : 'Z');
  const npmrcOf = (root) => readFileSync(join(root, '.npmrc'), 'utf8');

  it.runIf(process.platform === 'win32')('turns off the headless install once, keeping the other lines', () => {
    const root = appWith({ [CORE]: `link:${otherDrive()}:/brock/packages/core` }, 'auto-install-peers=true\nprefer-frozen-lockfile = true\n');
    expect(keepCrossDriveLinks(root)).toEqual([CORE]);
    expect(keepCrossDriveLinks(root)).toEqual([CORE]);
    expect(npmrcOf(root)).toBe('auto-install-peers=true\nprefer-frozen-lockfile=false\n');
    expect(readFileSync(join(root, '.gitattributes'), 'utf8')).toBe('pnpm-lock.yaml text eol=lf\n');
  });

  it('writes nothing for a same-drive link', () => {
    const root = appWith({ [CORE]: linkSpec(join(tmpdir(), 'brock', 'packages', 'core')) }, 'auto-install-peers=true\n');
    expect(keepCrossDriveLinks(root)).toEqual([]);
    expect(npmrcOf(root)).toBe('auto-install-peers=true\n');
    expect(existsSync(join(root, '.gitattributes'))).toBe(false);
  });
});
