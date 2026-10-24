/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { BRAND_IGNORES, reconcileBrandIgnores, syncBrandIgnores } from '../src/icons/brand-ignores.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const read = (root) => readFileSync(join(root, '.gitignore'), 'utf8');
const WITH_LOGOS = `node_modules/\n${BRAND_IGNORES.join('\n')}\n`;

describe('the generated icon lines of .gitignore', () => {
  it('are written when an app sets icons.brand', () => {
    const root = tempRepo({ '.gitignore': 'node_modules/\n' });
    expect(syncBrandIgnores(root, true)).toBe(true);
    expect(read(root).split('\n')).toEqual(expect.arrayContaining(['**/public/logos/icon.ico', '**/public/logos/icon-256.png', '**/public/logos/mark.svg', '**/build/icons/']));
    expect(syncBrandIgnores(root, true)).toBe(false);
  });

  it('are left out, and dropped on the next sync, when no app sets icons.brand', () => {
    const root = tempRepo({ '.gitignore': WITH_LOGOS });
    expect(syncBrandIgnores(root, false)).toBe(true);
    expect(read(root)).toBe('node_modules/\n');
    expect(syncBrandIgnores(root, false)).toBe(false);
  });

  it('keep every other line and the line endings', () => {
    expect(reconcileBrandIgnores('dist/\r\npublic/logos/icon-256.png\r\n.env\r\n', false)).toBe('dist/\r\n.env\r\n');
    expect(reconcileBrandIgnores('dist/\n', false)).toBeNull();
  });

  it('do not create a .gitignore', () => {
    const root = tempRepo({ 'a.txt': 'x' });
    expect(syncBrandIgnores(root, true)).toBe(false);
  });
});
