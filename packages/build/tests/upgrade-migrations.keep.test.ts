/* @layer tooling-scripts @kind test */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectMigrations, findJsxProps, removeSpans, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const MAIN = [
  "import { BrockApp } from '@drizztdourden08/brock-react';",
  '',
  'createRoot(root).render(',
  '  <BrockApp<AppSettings>',
  '    product={product}',
  '    onClose={() => count > 0}',
  '    logoSrc="./logos/icon-256.png"',
  '  />,',
  ');',
  '',
].join('\n');

const CUSTOM = [
  "const logo = './brand/logo.png';",
  'const app = <BrockApp product={product} logoSrc={logo} instanceLogoSrc="./brand/bot.svg" />;',
  '',
].join('\n');

const SETTINGS = [
  "      { key: 'windowMode', label: 'Window mode', description: 'Windowed, borderless or fullscreen.' },",
  "      { key: 'masterVolume', label: 'Master volume',",
  "        description: 'Overall output level.' },",
  '',
].join('\n');

const MENU = [
  'const MENU: MenuEntry[] = [',
  "  { key: 'settings', label: 'Settings', screen: 'settings' },",
  "  { key: 'about', label: 'About', screen: 'about' },",
  "  { key: 'info', label: 'Info', screen: 'about' },",
  '];',
  '',
].join('\n');

const dirs: string[] = [];

const app = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
  dirs.push(root);
  mkdirSync(join(root, 'src'), { recursive: true });
  mkdirSync(join(root, 'node_modules', 'dep'), { recursive: true });
  writeFileSync(join(root, 'src', 'main.tsx'), MAIN);
  writeFileSync(join(root, 'src', 'custom.tsx'), CUSTOM);
  writeFileSync(join(root, 'node_modules', 'dep', 'view.tsx'), MAIN);
  writeFileSync(join(root, 'src', 'settings.constants.ts'), SETTINGS);
  writeFileSync(join(root, 'src', 'menu.constants.ts'), MENU);
  writeFileSync(join(root, '.gitignore'), 'node_modules/\npublic/logos/icon.ico\n');
  return root;
};

const upgradeFrom = (from: string, to: string | null = null) => selectMigrations(collectMigrations([]), { from, to });

const logoOnly = () => upgradeFrom('0.1.0').filter((m) => m.file.endsWith('brock-app-logo-src.mjs'));

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('the 0.1.1 migration', () => {
  it('drops a default logoSrc and leaves numbered to-dos for the rest', async () => {
    const root = app();
    const run = await runMigrations(root, logoOnly());
    expect(run.applied.map((m) => m.id)).toEqual(['brock-app-logo-src']);
    expect(run.applied[0]?.touched).toEqual(['src/main.tsx']);
    expect(readFileSync(join(root, 'src', 'main.tsx'), 'utf8')).toBe(MAIN.replace('    logoSrc="./logos/icon-256.png"\n', ''));
    expect(readFileSync(join(root, 'src', 'custom.tsx'), 'utf8')).toBe(CUSTOM);
    expect(readFileSync(join(root, 'node_modules', 'dep', 'view.tsx'), 'utf8')).toBe(MAIN);
    expect(run.todos.map(({ number, file, line }) => ({ number, file, line }))).toEqual([
      { number: 1, file: 'src/custom.tsx', line: 2 },
      { number: 2, file: 'src/custom.tsx', line: 2 },
    ]);
    expect(run.todos[1]?.message).toContain('product.logos.instance to "./brand/bot.svg"');
  });

  it('changes nothing on a second run', async () => {
    const root = app();
    await runMigrations(root, upgradeFrom('0.1.0'));
    const again = await runMigrations(root, upgradeFrom('0.1.0'));
    expect(again.applied.flatMap((m) => m.touched)).toEqual([]);
    expect(again.todos).toHaveLength(4);
  });

  it('gives windowMode and masterVolume a control, or a to-do when the item spans lines', async () => {
    const root = app();
    const run = await runMigrations(root, upgradeFrom('0.1.0').filter((m) => m.file.endsWith('base-setting-controls.mjs')));
    const settings = readFileSync(join(root, 'src', 'settings.constants.ts'), 'utf8');
    expect(settings).toContain("'Windowed, borderless or fullscreen.', control: { kind: 'choice', options: [{ value: 'windowed'");
    expect(run.todos.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/settings.constants.ts:2']);
  });

  it('adds the generated logos and the profile store to .gitignore once', async () => {
    const root = app();
    const only = upgradeFrom('0.1.0').filter((m) => m.file.endsWith('gitignore-generated-files.mjs'));
    await runMigrations(root, only);
    const again = await runMigrations(root, only);
    const lines = readFileSync(join(root, '.gitignore'), 'utf8').split('\n');
    expect(again.applied[0]?.touched).toEqual([]);
    expect(lines.filter((line) => line === 'public/logos/icon.ico')).toHaveLength(1);
    expect(lines).toContain('.brock/profile-config.json');
  });

  it('drops the plain About menu entry and flags one that replaces it', async () => {
    const root = app();
    const run = await runMigrations(root, upgradeFrom('0.1.0').filter((m) => m.file.endsWith('menu-built-in-about.mjs')));
    expect(readFileSync(join(root, 'src', 'menu.constants.ts'), 'utf8')).toBe(MENU.replace("  { key: 'about', label: 'About', screen: 'about' },\n", ''));
    expect(run.todos.map(({ file, line }) => `${file}:${line}`)).toEqual(['src/menu.constants.ts:4']);
  });
});

describe('selectMigrations', () => {
  it('keeps the versions after from, up to to', () => {
    expect(upgradeFrom('0.2.0')).toEqual([]);
    expect(upgradeFrom('0.0.9', '0.1.0')).toEqual([]);
    expect(upgradeFrom('0.1.0', '0.1.1').map((m) => m.version)).toEqual(readdirSync(join(import.meta.dirname, '..', 'migrations', '0.1.1')).filter((f: string) => f.endsWith('.mjs')).map(() => '0.1.1'));
    expect(new Set(upgradeFrom('0.1.1').map((m) => m.version))).toEqual(new Set(['0.2.0']));
  });

  it('orders module migrations with the build ones by version', () => {
    const module = { packageName: '@x/brock-demo', dir: '/demo', manifest: { migrations: [{ version: '0.1.0', entry: './m.mjs', summary: 'Demo.' }] } };
    const picked = selectMigrations(collectMigrations([module]), { from: '0.0.1', to: null });
    expect(picked.map((m) => `${m.version} ${m.source}`).slice(0, 2)).toEqual(['0.1.0 @x/brock-demo', '0.1.1 @drizztdourden08/brock-build']);
  });
});

describe('findJsxProps and removeSpans', () => {
  it('reads past type arguments and arrow functions in the tag', () => {
    const [prop] = findJsxProps(MAIN, 'BrockApp', ['logoSrc']);
    expect(prop).toMatchObject({ name: 'logoSrc', line: 7, literal: './logos/icon-256.png' });
  });

  it('removes a prop that shares its line without touching the rest', () => {
    const props = findJsxProps(CUSTOM, 'BrockApp', ['logoSrc']);
    expect(props[0]?.literal).toBeNull();
    expect(removeSpans(CUSTOM, props)).toContain('<BrockApp product={product} instanceLogoSrc="./brand/bot.svg" />');
  });
});

describe('custom-layer-rename', () => {
  const only = () => upgradeFrom('0.1.0').filter((m) => m.file.endsWith('custom-layer-rename.mjs'));

  it('renames a root .custom.tsx to .layer.tsx, reports it, and leaves bucket custom pages alone', async () => {
    const root = app();
    mkdirSync(join(root, 'src', 'screens', 'game'), { recursive: true });
    writeFileSync(join(root, 'src', 'screens', 'playfield.custom.tsx'), CUSTOM);
    writeFileSync(join(root, 'src', 'screens', 'game', 'controls.custom.tsx'), CUSTOM);
    const run = await runMigrations(root, only());
    expect(run.applied[0]?.touched).toEqual(['src/screens/playfield.custom.tsx -> src/screens/playfield.layer.tsx']);
    expect(existsSync(join(root, 'src', 'screens', 'playfield.custom.tsx'))).toBe(false);
    expect(readFileSync(join(root, 'src', 'screens', 'playfield.layer.tsx'), 'utf8')).toBe(CUSTOM);
    expect(existsSync(join(root, 'src', 'screens', 'game', 'controls.custom.tsx'))).toBe(true);
    const again = await runMigrations(root, only());
    expect(again.applied[0]?.touched).toEqual([]);
  });

  it('leaves a to-do when the layer file already exists', async () => {
    const root = app();
    mkdirSync(join(root, 'src', 'screens'), { recursive: true });
    writeFileSync(join(root, 'src', 'screens', 'arena.custom.tsx'), CUSTOM);
    writeFileSync(join(root, 'src', 'screens', 'arena.layer.tsx'), MAIN);
    const run = await runMigrations(root, only());
    expect(run.applied[0]?.touched).toEqual([]);
    expect(run.todos.map(({ file, message }) => `${file}: ${message}`)).toEqual([
      'src/screens/arena.custom.tsx: rename it to src/screens/arena.layer.tsx, which already exists; merge the two files by hand',
    ]);
  });
});

describe('knip-custom-pages', () => {
  it('adds the custom page glob after src/main.tsx once', async () => {
    const root = app();
    const knip = '{\n  "entry": [\n    "electron/main.ts",\n    "src/main.tsx"\n  ],\n  "project": ["src/**/*.{ts,tsx}"]\n}\n';
    writeFileSync(join(root, 'knip.json'), knip);
    const only = upgradeFrom('0.1.0').filter((m) => m.file.endsWith('knip-custom-pages.mjs'));
    await runMigrations(root, only);
    const again = await runMigrations(root, only);
    const written = readFileSync(join(root, 'knip.json'), 'utf8');
    expect(again.applied[0]?.touched).toEqual([]);
    expect((JSON.parse(written) as { entry: string[] }).entry).toEqual(['electron/main.ts', 'src/main.tsx', 'src/screens/**/*.custom.tsx']);
  });
});

describe('removed-shell-exports', () => {
  it('turns each removed brock-react import into a to-do and leaves the file alone', async () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
    dirs.push(root);
    mkdirSync(join(root, 'src'), { recursive: true });
    const source = "import { BrockApp, TitleBar, About as AboutView } from '@drizztdourden08/brock-react';\nexport { TitleBar, AboutView, BrockApp };\n";
    writeFileSync(join(root, 'package.json'), '{"name":"x"}');
    writeFileSync(join(root, 'src', 'shell.tsx'), source);
    const only = upgradeFrom('0.1.0').filter((m) => m.file.endsWith('removed-shell-exports.mjs'));
    const run = await runMigrations(root, only);
    expect(readFileSync(join(root, 'src', 'shell.tsx'), 'utf8')).toBe(source);
    expect(run.todos.map((todo) => todo.message.split(' ')[0])).toEqual(['TitleBar', 'About']);
    expect(run.todos[0]?.message).toContain('WindowTitleBar');
  });
});

describe('index-boot-splash', () => {
  it('removes the hand-written boot splash and leaves an empty root', async () => {
    const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
    dirs.push(root);
    mkdirSync(join(root, 'src'), { recursive: true });
    writeFileSync(join(root, 'package.json'), '{"name":"x"}');
    const html = '<!DOCTYPE html>\n<html lang="en" class="booting">\n  <head>\n    <style>\n      #boot-splash { position: fixed; }\n    </style>\n  </head>\n  <body>\n    <div id="root">\n      <div id="boot-splash">\n        <img src="./logos/icon-256.png" alt="" />\n        <div class="boot-splash__spinner"></div>\n      </div>\n    </div>\n  </body>\n</html>\n';
    writeFileSync(join(root, 'src', 'index.html'), html);
    const only = upgradeFrom('0.1.0').filter((m) => m.file.endsWith('index-boot-splash.mjs'));
    const run = await runMigrations(root, only);
    const out = readFileSync(join(root, 'src', 'index.html'), 'utf8');
    expect(out).not.toMatch(/boot-splash|booting/);
    expect(out).toContain('<div id="root"></div>');
    expect(run.todos).toEqual([]);
  });
});
