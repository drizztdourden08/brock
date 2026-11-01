/* @layer tooling-scripts @kind test */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectMigrations, findJsxProps, removeSpans, selectMigrations } from '../src/upgrade/index.mjs';

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

const upgradeFrom = (from: string, to: string | null = null) => selectMigrations(collectMigrations([]), { from, to });

describe('K1 selectMigrations', { tags: ['critical'] }, () => {
  it('keeps the versions after from, up to to', () => {
    expect(upgradeFrom('0.0.9', '0.1.0')).toEqual([]);
    expect(upgradeFrom('0.1.0', '0.1.1').map((m) => m.version)).toEqual(readdirSync(join(import.meta.dirname, '..', 'migrations', '0.1.1')).filter((f: string) => f.endsWith('.mjs')).map(() => '0.1.1'));
  });

  it('orders module migrations with the build ones by version', () => {
    const module = { packageName: '@x/brock-demo', dir: '/demo', manifest: { migrations: [{ version: '0.1.0', entry: './m.mjs', summary: 'Demo.' }] } };
    const picked = selectMigrations(collectMigrations([module]), { from: '0.0.1', to: null });
    expect(picked.map((m) => `${m.version} ${m.source}`).slice(0, 2)).toEqual(['0.1.0 @x/brock-demo', '0.1.1 @drizztdourden08/brock-build']);
  });
});

describe('K1 findJsxProps and removeSpans', { tags: ['critical'] }, () => {
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
