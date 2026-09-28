/* @layer tooling-scripts @kind config */
import { join } from 'node:path';
import { loadBrockConfig } from './load-config.mjs';
import { createAfterPack } from './packaging/after-pack.mjs';
import { VELOPACK_ASAR_UNPACK } from './packaging/packaging.constants.mjs';

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
    ...(fa.mimeType ? { mimeType: fa.mimeType } : {}),
    ...(fa.icon ? { icon: fa.icon } : {}),
  }));

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
    ...(product.repo ? { publish: [{ provider: 'github', owner: product.repo.owner, repo: product.repo.name }] } : {}),
    win: {
      target: ['dir'],
      ...(icons.win ? { icon: icons.win } : {}),
      artifactName: artifact('win'),
      signAndEditExecutable: false,
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
  };
};

/**
 * @param {string} rootDir
 */
const loadBuilderConfig = async (rootDir) => {
  const cfg = await loadBrockConfig(rootDir);
  return createBuilderConfig(cfg.product, { rootDir });
};

export { createBuilderConfig, loadBuilderConfig, APP_FILES };
