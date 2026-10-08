/* @layer tooling-scripts @kind config */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadBrockConfig } from './load-config.mjs';
import { modulePackaging } from './modules/module-packaging.mjs';
import { createAfterPack } from './packaging/after-pack.mjs';
import { VELOPACK_ASAR_UNPACK } from './packaging/packaging.constants.mjs';
import { DEB_POSTINST_FILE } from './platforms/linux/linux.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

const APP_FILES = ['dist/electron/**/*', 'dist/preload/**/*', 'dist/renderer/**/*', 'package.json'];
const BRAND_BUILDER_ICONS = { win: 'build/icons/icon.ico', mac: 'build/icons/icon.png', linux: 'build/icons/png' };

/**
 * @param {ProductInput['icons']} icons
 * @returns {{ win?: string, mac?: string, linux?: string }}
 */
const builderIcons = (icons = {}) =>
  icons.brand ? BRAND_BUILDER_ICONS : { win: icons.ico, mac: icons.png512, linux: icons.png256 };

/**
 * @param {ProductInput['fileAssociations']} list
 */
const toBuilderAssociations = (list = []) =>
  list.map((fa) => ({
    ext: fa.ext,
    name: fa.name,
    mimeType: fa.mimeType ?? `application/x-${fa.ext.toLowerCase()}`,
    ...(fa.icon ? { icon: fa.icon } : {}),
  }));

/**
 * @param {ProductInput} product
 * @returns {{ name: string, schemes: string[] }[]} for Info.plist and the .desktop file
 */
const toBuilderProtocols = (product) =>
  (product.protocols ?? []).map(({ scheme, name }) => ({ name: name ?? product.name, schemes: [scheme] }));

/**
 * @param {ProductInput['fileAssociations']} list
 * @returns {{ extraResources?: { from: string, to: string }[] }} the icons the registry names
 */
const winFileIcons = (list = []) => {
  const icons = list.filter((fa) => fa.icon).map((fa) => ({ from: `build/${fa.icon}.ico`, to: `file-icons/${fa.ext.toLowerCase()}.ico` }));
  return icons.length ? { extraResources: icons } : {};
};

/**
 * @param {string} rootDir
 * @returns {{ deb?: { afterInstall: string } }} the post-install hook brock sync wrote, if any
 */
const debOptions = (rootDir) => (existsSync(join(rootDir, DEB_POSTINST_FILE)) ? { deb: { afterInstall: DEB_POSTINST_FILE } } : {});

/**
 * @param {ProductInput} product
 * @param {{ rootDir: string}} opts
 * @returns {Record<string, unknown>}  An electron-builder Configuration
 */
const createBuilderConfig = (product, { rootDir }) => {
  const prefix = product.artifactPrefix ?? `${product.id}-`;
  const icons = builderIcons(product.icons);
  const artifact = (os) => `${prefix}${os}-\${arch}.\${ext}`;
  return {
    appId: product.appId,
    productName: product.name,
    npmRebuild: false,
    directories: { output: join(rootDir, 'release'), ...(product.icons?.brand ? { buildResources: 'build' } : {}) },
    electronLanguages: ['en-US'],
    files: APP_FILES,
    asarUnpack: [VELOPACK_ASAR_UNPACK],
    afterPack: createAfterPack(rootDir, icons.win),
    fileAssociations: toBuilderAssociations(product.fileAssociations),
    protocols: toBuilderProtocols(product),
    ...(product.repo ? { publish: [{ provider: 'github', owner: product.repo.owner, repo: product.repo.name }] } : {}),
    win: {
      target: ['dir'],
      ...(icons.win ? { icon: icons.win } : {}),
      artifactName: artifact('win'),
      signAndEditExecutable: false,
      ...winFileIcons(product.fileAssociations),
    },
    mac: {
      target: ['dmg', 'zip'],
      ...(icons.mac ? { icon: icons.mac } : {}),
      artifactName: artifact('macos'),
      identity: '-',
    },
    linux: {
      target: ['AppImage', 'deb'],
      ...(icons.linux ? { icon: icons.linux } : {}),
      artifactName: artifact('linux'),
      executableName: product.id,
      ...(product.author?.email ? { maintainer: product.author.email } : {}),
    },
    ...debOptions(rootDir),
  };
};

/**
 * @param {string} rootDir
 */
const loadBuilderConfig = async (rootDir) => {
  const cfg = await loadBrockConfig(rootDir);
  const config = createBuilderConfig(cfg.product, { rootDir });
  const { extraResources, exclude } = modulePackaging(rootDir, cfg.modules);
  return {
    ...config,
    files: [...APP_FILES, ...exclude],
    ...(extraResources.length ? { extraResources } : {}),
  };
};

export { createBuilderConfig, loadBuilderConfig, APP_FILES };
