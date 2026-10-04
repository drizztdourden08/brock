/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tesseraBefore } from '../src/upgrade/tessera-before.mjs';

const made = [];

const repo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'thread-tessera-before-'));
  made.push(root);
  for (const [file, json] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), JSON.stringify(json));
  }
  return root;
};

const TESSERA = 'node_modules/@drizztdourden08/tessera/package.json';

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('tesseraBefore', () => {
  it('reads the installed Tessera when package.json has no brock.tessera', () => {
    expect(tesseraBefore(repo({ 'package.json': { name: 'app' }, [TESSERA]: { version: '0.3.2' } }))).toBe('0.3.2');
  });

  it('reads the Tessera installed in the app of a monorepo', () => {
    const root = repo({ 'package.json': { name: 'repo' }, [`apps/desktop/${TESSERA}`]: { version: '0.4.0' } });
    expect(tesseraBefore(root, join(root, 'apps', 'desktop'))).toBe('0.4.0');
  });

  it('takes the app pin first, then the root pin, over the installed Tessera', () => {
    const root = repo({
      'package.json': { brock: { tessera: '0.2.0' } },
      [TESSERA]: { version: '0.5.0' },
      'apps/desktop/package.json': { brock: { tessera: '0.4.0' } },
      'apps/web/package.json': { name: 'web' },
    });
    expect(tesseraBefore(root, join(root, 'apps', 'desktop'))).toBe('0.4.0');
    expect(tesseraBefore(root, join(root, 'apps', 'web'))).toBe('0.2.0');
    expect(tesseraBefore(root)).toBe('0.2.0');
  });

  it('gives null without a pin or an installed Tessera', () => {
    expect(tesseraBefore(repo({ 'package.json': { name: 'app' } }))).toBeNull();
  });
});
