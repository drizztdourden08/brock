/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_BACKGROUND, MANIFEST_FILE, MANIFEST_ICONS } from './web.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/product').ProductInput} ProductInput
 */

/**
 * @param {ProductInput} product
 * @param {typeof MANIFEST_ICONS} icons
 */
const manifestOf = (product, icons) => {
  const background = product.window?.backgroundColor ?? DEFAULT_BACKGROUND;
  return {
    name: product.name,
    short_name: product.name,
    ...(product.description ? { description: product.description } : {}),
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: background,
    theme_color: background,
    icons: icons.map((icon) => ({ src: icon.to, sizes: icon.sizes, type: 'image/png', purpose: icon.purpose })),
  };
};

/**
 * @param {{ rootDir: string, product: ProductInput }} opts
 * @returns {import('vite').Plugin} manifest.webmanifest from the product
 */
const webManifestPlugin = ({ rootDir, product }) => {
  const icons = MANIFEST_ICONS.filter((icon) => existsSync(join(rootDir, icon.from)));
  return {
    name: 'brock-web-manifest',
    apply: 'build',
    transformIndexHtml: () => [{ tag: 'link', attrs: { rel: 'manifest', href: `./${MANIFEST_FILE}` }, injectTo: 'head' }],
    generateBundle() {
      for (const icon of icons.filter((entry) => !entry.public)) {
        this.emitFile({ type: 'asset', fileName: icon.to, source: readFileSync(join(rootDir, icon.from)) });
      }
      this.emitFile({ type: 'asset', fileName: MANIFEST_FILE, source: `${JSON.stringify(manifestOf(product, icons), null, 2)}\n` });
    },
  };
};

export { webManifestPlugin };
