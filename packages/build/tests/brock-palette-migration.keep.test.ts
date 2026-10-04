/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const made: string[] = [];
const palette = () => selectMigrations(collectMigrations([]), { from: '0.10.0', to: '0.11.0' }).filter((m) => m.file.endsWith('brock-palette.mjs'));

const OLD = '/* @layer renderer-app @kind style */\n\n:root {\n  --p-primary: #3b6fe0;\n  --p-secondary: #9dbbff;\n  --p-tertiary: #8e96a8;\n  --p-on-primary: var(--p-pure-white);\n  --p-on-secondary: var(--p-black);\n  --p-on-tertiary: var(--p-black);\n}\n';

const appWith = (theme: string): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-palette-'));
  made.push(root);
  writeFileSync(join(root, 'package.json'), '{"name":"x"}');
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'src', 'theme.css'), theme);
  return root;
};

const themeOf = (root: string): string => readFileSync(join(root, 'src', 'theme.css'), 'utf8');

afterEach(() => {
  for (const dir of made.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('brock-palette', () => {
  it('swaps the untouched old starter seeds for the Brock palette, once', async () => {
    const root = appWith(OLD);
    await runMigrations(root, palette());
    const theme = themeOf(root);
    expect(theme.startsWith('/* @layer renderer-app @kind style */\n\n:root {\n  --p-primary: #f0862b;')).toBe(true);
    expect(theme).toContain('--p-black: #121314;');
    const again = await runMigrations(root, palette());
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
  });

  it('leaves a theme the app changed alone', async () => {
    const own = OLD.replace('#3b6fe0', '#228844');
    const root = appWith(own);
    await runMigrations(root, palette());
    expect(themeOf(root)).toBe(own);
  });
});
