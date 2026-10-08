/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { SITE_FAVICON_PATH } from './site.constants.mjs';

/**
 * @param {string} siteDir
 * @param {string | null} brand
 * @returns {string | null} the brand's icon.svg in the installed Tessera
 */
const brandIconOf = (siteDir, brand) => {
  if (!brand) return null;
  try {
    const tessera = dirname(createRequire(join(siteDir, 'package.json')).resolve('@drizztdourden08/tessera/package.json'));
    const icon = join(tessera, 'brand', brand, 'icon', 'icon.svg');
    return existsSync(icon) ? icon : null;
  } catch {
    return null;
  }
};

const htmlTags = (icon) => (icon ? [{ tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: SITE_FAVICON_PATH }, injectTo: 'head' }] : []);

const withPalette = (html, brand) => (brand ? html.replace(/<html(?![^>]*data-palette)([^>]*)>/i, `<html$1 data-palette="${brand}">`) : html);

const withTitle = (html, name) => (/<title>/i.test(html) ? html : html.replace(/<\/head>/i, `    <title>${name}</title>\n  </head>`));

/**
 * @param {{ siteDir: string, site: { id: string, name: string, brand: string | null } }} opts
 * @returns {import('vite').Plugin} the palette, the title, the favicon
 */
const sitePlugin = ({ siteDir, site }) => {
  const icon = brandIconOf(siteDir, site.brand);
  return {
    name: 'brock-site',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => ({ html: withTitle(withPalette(html, site.brand), site.name), tags: htmlTags(icon) }),
    },
    configureServer(server) {
      if (!icon) return;
      server.middlewares.use(SITE_FAVICON_PATH, (req, res) => {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(readFileSync(icon));
      });
    },
    generateBundle() {
      if (icon) this.emitFile({ type: 'asset', fileName: SITE_FAVICON_PATH.slice(1), source: readFileSync(icon) });
    },
  };
};

export { sitePlugin };
