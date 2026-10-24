/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { END, reconcileBrandIgnores, START, syncBrandIgnores } from '../src/icons/brand-ignores.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const read = (root) => readFileSync(join(root, '.gitignore'), 'utf8');
const lines = (root) => read(root).split('\n');

describe('the generated icon lines of .gitignore', () => {
  it('are written for a branded single-app repo, anchored at the root, inside the marked block', () => {
    const root = tempRepo({ '.gitignore': 'node_modules/\n' });
    expect(syncBrandIgnores(root, [''])).toBe(true);
    const all = lines(root);
    expect(all).toEqual(expect.arrayContaining(['/public/logos/icon.ico', '/public/logos/icon-256.png', '/public/logos/mark.svg', '/build/icons/', '/build/filetypes/']));
    expect(all.indexOf(START)).toBeGreaterThan(all.indexOf('node_modules/'));
    expect(all.indexOf(END)).toBeGreaterThan(all.indexOf('/build/icons/'));
    expect(syncBrandIgnores(root, [''])).toBe(false);
  });

  it('are left out when no app sets icons.brand, and dropped with the block on the next sync', () => {
    const root = tempRepo({ '.gitignore': 'node_modules/\n' });
    expect(syncBrandIgnores(root, [])).toBe(false);
    syncBrandIgnores(root, ['']);
    expect(syncBrandIgnores(root, [])).toBe(true);
    expect(read(root)).toBe('node_modules/\n');
    expect(syncBrandIgnores(root, [])).toBe(false);
  });

  it('name only the branded app in a mixed workspace and keep the unbranded app files tracked', () => {
    const root = tempRepo({ '.gitignore': 'node_modules/\n' });
    syncBrandIgnores(root, ['apps/editor']);
    const all = lines(root);
    expect(all).toContain('apps/editor/public/logos/icon.ico');
    expect(all.filter((line) => line.startsWith('apps/viewer/'))).toEqual([]);
    expect(all.filter((line) => line.startsWith('**/'))).toEqual([]);
  });

  it('edit only the marked block and leave the rest of the file alone', () => {
    const source = `dist/\n${START}\nold/line\n${END}\n.env\n`;
    const next = reconcileBrandIgnores(source, ['apps/editor']);
    expect(next.startsWith(`dist/\n${START}\napps/editor/build/icons/\n`)).toBe(true);
    expect(next.endsWith(`${END}\n.env\n`)).toBe(true);
    expect(next).not.toContain('old/line');
  });

  it('drop the old unscoped lines and keep the line endings', () => {
    expect(reconcileBrandIgnores('dist/\r\n**/public/logos/icon-256.png\r\n.env\r\n', [])).toBe('dist/\r\n.env\r\n');
    expect(reconcileBrandIgnores('dist/\n', [])).toBeNull();
  });

  it('do not create a .gitignore', () => {
    const root = tempRepo({ 'a.txt': 'x' });
    expect(syncBrandIgnores(root, [''])).toBe(false);
  });
});
