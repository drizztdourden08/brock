/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuilderConfig } from '../src/builder-config.mjs';
import { BRAND_FILES, FILETYPE_SIZES } from '../src/icons/brand-files.mjs';
import { BOT_BRAND_FILES } from '../src/icons/bot/bot.constants.mjs';
import { copyBrandIcons } from '../src/icons/copy-brand-icons.mjs';
import { filetypeFiles } from '../src/icons/filetype-icons.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const TESSERA = 'node_modules/@drizztdourden08/tessera';
const BRAND = `${TESSERA}/brand/atlas`;

const typeFiles = (folder) => ({
  [`${BRAND}/filetypes/${folder}/icon.ico`]: `${folder}:ico`,
  [`${BRAND}/filetypes/${folder}/icon.icns`]: `${folder}:icns`,
  ...Object.fromEntries(FILETYPE_SIZES.map((size) => [`${BRAND}/filetypes/${folder}/png/icon-${size}.png`, `${folder}:${size}`])),
});

const brandOf = (root) => join(root, BRAND);

const sampleApp = (folders) => tempRepo({
  'package.json': '{"name":"app"}',
  [`${TESSERA}/package.json`]: '{"name":"@drizztdourden08/tessera","version":"0.8.0"}',
  ...Object.fromEntries([...BRAND_FILES, ...BOT_BRAND_FILES].map(({ from }) => [`${BRAND}/${from}`, from])),
  [`${TESSERA}/brand/atlas.svg`]: 'mark',
  [`${TESSERA}/brand/dark-ground/atlas.svg`]: 'ground',
  ...Object.assign({}, ...folders.map(typeFiles)),
});

const PRODUCT = {
  id: 'atlas',
  name: 'Atlas',
  appId: 'com.example.atlas',
  author: { name: 'someone' },
  icons: { brand: 'atlas' },
  fileAssociations: [
    { ext: 'MD', name: 'Markdown Note', progId: 'Atlas.Md' },
    { ext: 'map', name: 'World Map', progId: 'Atlas.Map' },
    { ext: 'zip', name: 'Archive', progId: 'Atlas.Zip', icon: 'file-icons/zip' },
  ],
};

const read = (root, file) => readFileSync(join(root, file), 'utf8');

describe('filetypeFiles', () => {
  it('maps the brand folder of an extension to an ico, an icns and the Linux sizes', () => {
    const root = sampleApp(['md']);
    const files = filetypeFiles(brandOf(root), PRODUCT.fileAssociations);
    expect(files.map(({ to }) => to)).toEqual([
      'build/filetypes/md.ico',
      'build/filetypes/md.icns',
      ...FILETYPE_SIZES.map((size) => `build/filetypes/linux/md/${size}x${size}.png`),
    ]);
  });

  it('finds a type by its name when no folder carries the extension', () => {
    const root = sampleApp(['world-map']);
    const files = filetypeFiles(brandOf(root), PRODUCT.fileAssociations);
    expect(files[0]).toEqual({ from: 'filetypes/world-map/icon.ico', to: 'build/filetypes/map.ico' });
  });

  it('is empty for a brand without a filetypes folder', () => {
    const root = sampleApp([]);
    expect(filetypeFiles(brandOf(root), PRODUCT.fileAssociations)).toEqual([]);
  });
});

describe('brand file type icons in an app', () => {
  it('copies the sets of the types the brand has and leaves the others alone', () => {
    const root = sampleApp(['md']);
    const result = copyBrandIcons(root, { product: PRODUCT });
    expect(read(root, 'build/filetypes/md.ico')).toBe('md:ico');
    expect(read(root, 'build/filetypes/md.icns')).toBe('md:icns');
    expect(read(root, 'build/filetypes/linux/md/256x256.png')).toBe('md:256');
    expect(result?.written).not.toContain('build/filetypes/map.ico');
  });

  it('points each association at its generated icon and keeps an icon the app set', () => {
    const root = sampleApp(['md', 'zip']);
    copyBrandIcons(root, { product: PRODUCT });
    const config = createBuilderConfig(PRODUCT, { rootDir: root });
    const byExt = Object.fromEntries(config.fileAssociations.map((fa) => [fa.ext, fa.icon]));
    expect(byExt).toEqual({ MD: 'filetypes/md', map: undefined, zip: 'file-icons/zip' });
    expect(config.win.extraResources).toContainEqual({ from: 'build/filetypes/md.ico', to: 'file-icons/md.ico' });
  });

  it('keeps the association icons as they were before brock icons wrote anything, and without a brand', () => {
    const root = sampleApp(['md']);
    expect(createBuilderConfig(PRODUCT, { rootDir: root }).fileAssociations.map((fa) => fa.icon)).toEqual([undefined, undefined, 'file-icons/zip']);
    copyBrandIcons(root, { product: PRODUCT });
    const unbranded = createBuilderConfig({ ...PRODUCT, icons: {} }, { rootDir: root });
    expect(unbranded.fileAssociations.map((fa) => fa.icon)).toEqual([undefined, undefined, 'file-icons/zip']);
  });
});
