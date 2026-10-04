/* @layer tooling-scripts @kind logic */
import { appLook } from '../look/app-look.mjs';
import { lookProperties } from './look-properties.mjs';
import { ownsSplashPage } from './owns-splash-page.mjs';
import { renderSplashPage } from './render-splash-page.mjs';
import { SPLASH_PAGE } from './splash.constants.mjs';
import { splashStyles } from './splash-styles.mjs';

/**
 * @param {string} rootDir
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<string>}
 */
const splashPageOf = async (rootDir, product) => {
  const { config, look } = await appLook(rootDir, product);
  const brand = config.icons.brand ?? null;
  return renderSplashPage({ name: config.window.title ?? config.name, mark: config.logos.mark, palette: brand, styles: splashStyles(rootDir, look, brand) });
};

/**
 * @param {string} rootDir
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product
 * @returns {Promise<import('vite').HtmlTagDescriptor[]>}  The look as custom properties, so the window draws the boot failure splash as the splash page does
 */
const lookTagsOf = async (rootDir, product) => {
  const { look } = await appLook(rootDir, product);
  return [{ tag: 'style', attrs: { 'data-brock-look': '' }, children: lookProperties(look), injectTo: 'head' }];
};

/**
 * @param {{ rootDir: string, product: import('@drizztdourden08/brock-core/product').ProductInput }} opts
 * @returns {import('vite').Plugin}
 */
const splashPlugin = ({ rootDir, product }) => {
  const generated = !ownsSplashPage(rootDir);
  return {
    name: 'brock-splash',
    configureServer: (server) => {
      if (!generated) return;
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== `/${SPLASH_PAGE}`) return next();
        splashPageOf(rootDir, product).then((page) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(page);
        }, next);
        return undefined;
      });
    },
    transformIndexHtml: () => lookTagsOf(rootDir, product),
    async generateBundle() {
      if (generated) this.emitFile({ type: 'asset', fileName: SPLASH_PAGE, source: await splashPageOf(rootDir, product) });
    },
  };
};

export { splashPlugin };
