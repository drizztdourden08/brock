/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { BRAND_FILES } from '../src/icons/brand-files.mjs';
import { BOT_BRAND_FILES } from '../src/icons/bot/bot.constants.mjs';
import { copyBrandIcons } from '../src/icons/copy-brand-icons.mjs';

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const write = (file, text) => {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
};

const brandSet = (brandDir, tag) => {
  [...BRAND_FILES, ...BOT_BRAND_FILES].forEach(({ from }) => write(join(brandDir, from), `${tag}:${from}`));
};

const sampleApp = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-rim-'));
  roots.push(root);
  const tessera = join(root, 'node_modules', '@drizztdourden08', 'tessera');
  write(join(root, 'package.json'), '{"name":"app"}');
  write(join(tessera, 'package.json'), '{"name":"@drizztdourden08/tessera","version":"0.8.0"}');
  for (const [folder, tag] of [['brand', 'plain'], ['brand/light-rim', 'light'], ['brand/dark-rim', 'dark']]) {
    brandSet(join(tessera, folder, 'brock'), tag);
    brandSet(join(tessera, folder, 'atlas'), tag);
    write(join(tessera, folder, 'brock.svg'), `${tag}:mark`);
    write(join(tessera, folder, 'atlas.svg'), `${tag}:mark`);
  }
  write(join(tessera, 'brand', 'dark-ground', 'brock.svg'), 'ground:brock');
  write(join(tessera, 'brand', 'dark-ground', 'atlas.svg'), 'ground:atlas');
  return root;
};

const read = (root, file) => readFileSync(join(root, file), 'utf8');

describe('copyBrandIcons with a rim', () => {
  it('copies the light rim set for brock, the dark ground mark for the splash, and the 32 and 24 px title bar icons', () => {
    const root = sampleApp();
    const result = copyBrandIcons(root, { product: { icons: { brand: 'brock' } } });
    expect(result?.brandDir.split('\\').join('/')).toMatch(/brand\/light-rim\/brock$/);
    expect(read(root, 'public/logos/icon-32.png')).toBe('light:icon/png/icon-32.png');
    expect(read(root, 'public/logos/icon-24.png')).toBe('light:icon/png/icon-24.png');
    expect(read(root, 'public/logos/mark.svg')).toBe('ground:brock');
    expect(read(root, 'build/icons/icon.ico')).toBe('light:icon/icon.ico');
    expect(read(root, 'public/logos/icon-bot.svg')).toBe('light:bot/icon.svg');
  });

  it('takes the rim icons.rim names and the plain set for a brand with no rim', () => {
    const dark = sampleApp();
    copyBrandIcons(dark, { product: { icons: { brand: 'brock', rim: 'dark' } } });
    expect(read(dark, 'public/logos/icon-256.png')).toBe('dark:icon/png/icon-256.png');
    const plain = sampleApp();
    copyBrandIcons(plain, { product: { icons: { brand: 'atlas' } } });
    expect(read(plain, 'public/logos/mark.svg')).toBe('ground:atlas');
  });

  it('recopies a set whose files differ from the copies, even when the copies are newer', () => {
    const root = sampleApp();
    copyBrandIcons(root, { product: { icons: { brand: 'atlas' } } });
    const again = copyBrandIcons(root, { product: { icons: { brand: 'atlas', rim: 'light' } } });
    expect(read(root, 'public/logos/icon-32.png')).toBe('light:icon/png/icon-32.png');
    expect(again?.written).toContain('public/logos/icon-32.png');
  });
});
