/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { appThemeCss } from '../src/look/app-theme-css.mjs';
import { readTokenCss } from '../src/splash/read-token-css.mjs';

const TESSERA = dirname(createRequire(import.meta.url).resolve('@drizztdourden08/tessera/package.json'));
const SCHEMA = './node_modules/@drizztdourden08/tessera/tessera.config.schema.json';
const made = [];

const posix = (path) => path.replace(/\\/g, '/');

const appWith = (files, tessera = TESSERA) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-theme-'));
  made.push(root);
  for (const [file, text] of Object.entries({ 'package.json': '{"name":"app"}', ...files })) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), typeof text === 'string' ? text : JSON.stringify(text));
  }
  mkdirSync(join(root, 'node_modules', '@drizztdourden08'), { recursive: true });
  symlinkSync(tessera, join(root, 'node_modules', '@drizztdourden08', 'tessera'), 'junction');
  return root;
};

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('appThemeCss', () => {
  it('falls back to src/theme.css when the repo has no tessera.config.json', () => {
    const root = appWith({});
    expect(posix(appThemeCss(root))).toBe(posix(join(root, 'src', 'theme.css')));
  });

  it('keeps src/theme.css for a config that holds only $schema', () => {
    const root = appWith({ 'tessera.config.json': { $schema: SCHEMA } });
    expect(posix(appThemeCss(root))).toBe(posix(join(root, 'src', 'theme.css')));
  });

  it('reads theme.css from tessera.config.json', () => {
    const root = appWith({ 'tessera.config.json': { $schema: SCHEMA, theme: { css: 'styles/look.css' } } });
    expect(posix(appThemeCss(root))).toBe(posix(join(root, 'styles', 'look.css')));
  });

  it('takes the apps entry of a monorepo app', () => {
    const root = appWith({
      'tessera.config.json': { package: '@acme/design', apps: { 'apps/desktop': { theme: { css: 'apps/desktop/src/theme.css' } } } },
      'apps/desktop/package.json': '{"name":"@acme/desktop"}',
    });
    expect(posix(appThemeCss(join(root, 'apps', 'desktop')))).toBe(posix(join(root, 'apps', 'desktop', 'src', 'theme.css')));
  });

  it('names the file when the config is wrong', () => {
    const root = appWith({ 'tessera.config.json': { theme: { file: 'x.css' } } });
    expect(() => appThemeCss(root)).toThrow(new RegExp(`${posix(join(root, 'tessera.config.json')).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: unknown key "theme.file"`));
    expect(() => appThemeCss(root)).toThrow(/Brock reads theme\.css from this file/);
  });

  it('falls back to src/theme.css with a Tessera that has no config entry', () => {
    const old = mkdtempSync(join(tmpdir(), 'brock-old-tessera-'));
    made.push(old);
    writeFileSync(join(old, 'package.json'), JSON.stringify({ name: '@drizztdourden08/tessera', exports: { '.': './index.mjs' } }));
    const root = appWith({ 'tessera.config.json': { theme: { css: 'styles/look.css' } } }, old);
    expect(posix(appThemeCss(root))).toBe(posix(join(root, 'src', 'theme.css')));
  });
});

describe('the splash token stylesheet', () => {
  it('ends with the theme tessera.config.json names', () => {
    const root = appWith({ 'tessera.config.json': { theme: { css: 'styles/look.css' } }, 'styles/look.css': ':root { --p-primary: #123456; }\n' });
    expect(readTokenCss(root, TESSERA).trimEnd().endsWith(':root { --p-primary: #123456; }')).toBe(true);
  });
});
