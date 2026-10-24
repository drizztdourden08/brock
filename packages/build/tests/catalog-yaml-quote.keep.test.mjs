/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readYamlScalar, yamlScalar } from '@drizztdourden08/brock-thread';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { mergeCatalog } from '../src/workspace.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

const RANGE = '>=0.58.0 <1';

const catalogOf = (root) => parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8')).catalog;

afterEach(removeTempRepos);

describe('yamlScalar', () => {
  it('leaves ordinary ranges plain so existing files do not change', () => {
    ['^1.2.3', '~4.5.6', '1.2.3', '^0.59.0', 'latest', 'catalog:x'].forEach((value) => expect(yamlScalar(value)).toBe(value));
  });

  it('quotes what a plain scalar cannot hold', () => {
    expect(yamlScalar(RANGE)).toBe("'>=0.58.0 <1'");
    expect(yamlScalar('*')).toBe("'*'");
    expect(yamlScalar('a: b')).toBe("'a: b'");
    expect(yamlScalar('a #b')).toBe("'a #b'");
    expect(yamlScalar(' 1')).toBe("' 1'");
    expect(yamlScalar('catalog:')).toBe("'catalog:'");
    expect(yamlScalar("it's")).toBe("'it''s'");
  });

  it('quotes a value YAML would read as another type', () => {
    ['1.2', 'true', 'null', '~', '42'].forEach((value) => expect(yamlScalar(value)).toBe(`'${value}'`));
  });

  it('round-trips through a YAML parser and through readYamlScalar', () => {
    ['^1.2.3', RANGE, '*', '1.2', "it's", '>=1 <2 || ^3', 'a: b', '|x', '@scope/x'].forEach((value) => {
      expect(parse(`k: ${yamlScalar(value)}\n`).k).toBe(value);
      expect(readYamlScalar(yamlScalar(value))).toBe(value);
    });
    expect(readYamlScalar('"^1.0.0"')).toBe('^1.0.0');
  });
});

describe('mergeCatalog', () => {
  it('writes a range YAML cannot read plain as a quoted value', () => {
    const root = tempRepo({ 'pnpm-workspace.yaml': "packages: []\ncatalog:\n  zustand: ^5.0.0\n" });
    expect(mergeCatalog(root, { '@drizztdourden08/tessera': RANGE, react: '^19.2.6' })).toEqual(['@drizztdourden08/tessera', 'react']);
    const text = readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8');
    expect(text).toContain("  '@drizztdourden08/tessera': '>=0.58.0 <1'\n");
    expect(text).toContain('  react: ^19.2.6\n');
    expect(catalogOf(root)).toEqual({ '@drizztdourden08/tessera': RANGE, react: '^19.2.6', zustand: '^5.0.0' });
  });

  it('starts a catalog in a file that has none', () => {
    const root = tempRepo({ 'pnpm-workspace.yaml': 'packages: []\n' });
    mergeCatalog(root, { '@drizztdourden08/tessera': RANGE });
    expect(catalogOf(root)).toEqual({ '@drizztdourden08/tessera': RANGE });
  });

  it('does not add a quoted entry twice', () => {
    const root = tempRepo({ 'pnpm-workspace.yaml': "packages: []\ncatalog:\n  '@drizztdourden08/tessera': '>=0.58.0 <1'\n" });
    expect(mergeCatalog(root, { '@drizztdourden08/tessera': RANGE })).toEqual([]);
  });
});
