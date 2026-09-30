/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

const dirs: string[] = [];

const app = (): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
  dirs.push(root);
  mkdirSync(join(root, 'src'), { recursive: true });
  mkdirSync(join(root, 'node_modules', 'dep'), { recursive: true });
  writeFileSync(join(root, 'src', 'main.tsx'), MAIN);
  writeFileSync(join(root, 'src', 'custom.tsx'), CUSTOM);
  writeFileSync(join(root, 'node_modules', 'dep', 'view.tsx'), MAIN);
  return root;
};

const upgradeFrom = (from: string, to: string | null = null) => selectMigrations(collectMigrations([]), { from, to });

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('the 0.1.1 migration', () => {
  it('drops a default logoSrc and leaves numbered to-dos for the rest', async () => {
    const root = app();
    const run = await runMigrations(root, upgradeFrom('0.1.0', '0.1.1'));
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
    expect(again.applied[0]?.touched).toEqual([]);
    expect(again.todos).toHaveLength(2);
  });
});

describe('selectMigrations', () => {
  it('keeps the versions after from, up to to', () => {
    expect(upgradeFrom('0.1.1')).toEqual([]);
    expect(upgradeFrom('0.0.9', '0.1.0')).toEqual([]);
    expect(upgradeFrom('0.1.0').map((m) => m.version)).toEqual(['0.1.1']);
  });

  it('orders module migrations with the build ones by version', () => {
    const module = { packageName: '@x/brock-demo', dir: '/demo', manifest: { migrations: [{ version: '0.1.0', entry: './m.mjs', summary: 'Demo.' }] } };
    const picked = selectMigrations(collectMigrations([module]), { from: '0.0.1', to: null });
    expect(picked.map((m) => `${m.version} ${m.source}`)).toEqual(['0.1.0 @x/brock-demo', '0.1.1 @drizztdourden08/brock-build']);
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
