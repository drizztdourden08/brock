/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { writePnpmFiles } from '../src/pnpm-files.mjs';
import { copyTemplate, locateTemplate } from '../src/template.mjs';
import { tesseraRange } from '../src/tessera-range.mjs';
import { dropRootOwned } from '../src/workspace-member.mjs';

const TESSERA = '@drizztdourden08/tessera';

const made = [];

const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), 'create-brock-workspace-'));
  made.push(dir);
  return dir;
};

const put = (root, path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const reactPeerRange = () => JSON.parse(readFileSync(join(import.meta.dirname, '../../react/package.json'), 'utf8')).peerDependencies[TESSERA];

describe('the Tessera range of a scaffolded app', () => {
  it('is the range brock-react peers on', () => {
    expect(tesseraRange(locateTemplate())).toBe(reactPeerRange());
  });

  it('wins over a stale catalog entry when the workspace root gains its catalog', () => {
    const dir = tempDir();
    const template = join(dir, 'template');
    put(template, 'pnpm-workspace.yaml', `catalog:\n  '${TESSERA}': ^0.46.1\n`);
    put(template, 'brock-react.package.json', JSON.stringify({ peerDependencies: { [TESSERA]: '^0.51.0' } }));
    put(dir, 'pnpm-workspace.yaml', "packages:\n  - 'apps/*'\n");
    put(dir, 'package.json', JSON.stringify({ name: 'root', packageManager: 'pnpm@10.17.0' }));
    put(dir, 'apps/desktop/package.json', JSON.stringify({ name: 'desktop', dependencies: { [TESSERA]: 'catalog:' } }));
    writePnpmFiles(join(dir, 'apps/desktop'), template, dir);
    const yaml = readFileSync(join(dir, 'pnpm-workspace.yaml'), 'utf8');
    expect(yaml).toContain(`'${TESSERA}': ^0.51.0`);
    expect(yaml).not.toContain('0.46.1');
  });
});

describe('a workspace member app', () => {
  it('gets no brock.workspace.mjs, no root-only dependencies and no root-only knip entries', () => {
    const dir = tempDir();
    copyTemplate(locateTemplate(), dir);
    expect(existsSync(join(dir, 'brock.workspace.mjs'))).toBe(true);
    dropRootOwned(dir);
    expect(existsSync(join(dir, 'brock.workspace.mjs'))).toBe(false);
    expect(existsSync(join(dir, 'eslint.config.mjs'))).toBe(false);
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
    expect(pkg.devDependencies).not.toHaveProperty('@drizztdourden08/brock-thread');
    expect(pkg.devDependencies).not.toHaveProperty('stylelint-config-standard');
    const knip = JSON.parse(readFileSync(join(dir, 'knip.json'), 'utf8'));
    expect(knip.entry).not.toContain('brock.workspace.mjs');
    expect(knip.entry).toContain('brock.config.ts');
  });
});
