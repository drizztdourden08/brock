/* @layer tooling-scripts @kind test */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { BOT_BRAND_FILES } from '../src/icons/bot/bot.constants.mjs';
import { BRAND_FILES } from '../src/icons/brand-files.mjs';
import { preparePackageIcons } from '../src/packaging/package-icons.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const TESSERA = 'node_modules/@drizztdourden08/tessera';

const cleanCheckout = () => tempRepo({
  'package.json': '{"name":"atlas"}',
  [`${TESSERA}/package.json`]: '{"name":"@drizztdourden08/tessera","version":"0.31.0"}',
  [`${TESSERA}/brand/dark-ground/atlas.svg`]: 'mark',
  ...Object.fromEntries([...BRAND_FILES, ...BOT_BRAND_FILES].map(({ from }) => [`${TESSERA}/brand/atlas/${from}`, from])),
});

const PRODUCT = { id: 'atlas', name: 'Atlas', appId: 'com.example.atlas', author: { name: 'someone' }, icons: { brand: 'atlas' } };

const ELECTRON_BUILDER_SET_NAME = /^\d+(?:x\d+)?\.png$/i;

describe('brock package from a clean checkout', () => {
  it('writes the icons electron-builder takes on every platform before it runs', () => {
    const root = cleanCheckout();
    expect(existsSync(join(root, 'build', 'icons'))).toBe(false);
    for (const platform of ['win32', 'darwin', 'linux']) expect(preparePackageIcons(root, { product: PRODUCT }, platform)).toBeNull();
    const { win, mac, linux } = createBuilderConfig(PRODUCT, { rootDir: root });
    expect(existsSync(join(root, win.icon))).toBe(true);
    expect(existsSync(join(root, mac.icon))).toBe(true);
    const set = readdirSync(join(root, linux.icon));
    expect(set.length).toBeGreaterThan(0);
    expect(set.every((name) => ELECTRON_BUILDER_SET_NAME.test(name))).toBe(true);
    expect(set).toContain('256x256.png');
  });

  it('stops with the reason when the product names no icon for the platform', () => {
    const root = cleanCheckout();
    const product = { ...PRODUCT, icons: {} };
    expect(preparePackageIcons(root, { product }, 'linux')).toMatch(/no linux icon/);
    expect(preparePackageIcons(root, { product: { ...PRODUCT, icons: { png256: 'build/missing.png' } } }, 'linux')).toMatch(/build\/missing\.png is missing/);
  });
});
