/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { followTessera } from '../src/upgrade/follow-tessera.mjs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const made = [];

const app = (spec, catalog) => {
  const root = mkdtempSync(join(tmpdir(), 'thread-follow-tessera-'));
  made.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'app', dependencies: { '@drizztdourden08/tessera': spec } }));
  if (catalog) writeFileSync(join(root, 'pnpm-workspace.yaml'), catalog);
  return root;
};

const specOf = (root) => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).dependencies['@drizztdourden08/tessera'];

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('followTessera', () => {
  it('moves a catalog entry to the range Brock asks for', () => {
    const root = app('catalog:', "catalog:\n  '@drizztdourden08/tessera': ^0.3.0\n  zustand: ^5.0.0\n");
    expect(followTessera(root, '^0.4.0')).toEqual(['catalog.@drizztdourden08/tessera']);
    expect(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8')).toBe("catalog:\n  '@drizztdourden08/tessera': ^0.4.0\n  zustand: ^5.0.0\n");
    expect(followTessera(root, '^0.4.0')).toEqual([]);
  });

  it('moves a plain spec', () => {
    const root = app('^0.3.0');
    expect(followTessera(root, '^0.4.0')).toEqual(['dependencies.@drizztdourden08/tessera']);
    expect(specOf(root)).toBe('^0.4.0');
  });

  it('leaves a linked Tessera and an open range alone', () => {
    const linked = app('link:X:/tessera');
    expect(followTessera(linked, '^0.4.0')).toEqual([]);
    expect(specOf(linked)).toBe('link:X:/tessera');
    expect(followTessera(app('^0.3.0'), '*')).toEqual([]);
  });
});
