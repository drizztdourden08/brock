/* @layer tooling-scripts @kind logic */
import { appLookCache } from '../look/app-look-cache.mjs';
import { lookProperties } from './look-properties.mjs';
import { ownsSplashPage } from './owns-splash-page.mjs';
import { renderSplashPage } from './render-splash-page.mjs';
import { SPLASH_PAGE } from './splash.constants.mjs';
import { splashStyles } from './splash-styles.mjs';

/**
 * @typedef {ReturnType<typeof appLookCache>} LookCache
 */

/**
 * @param {string} rootDir
 * @param {LookCache} looks
 * @returns {Promise<string>}
 */
const splashPageOf = async (rootDir, looks) => {
  const { config, look, dark } = await looks.get();
  const brand = config.icons.brand ?? null;
  return renderSplashPage({ name: config.window.title ?? config.name, mark: config.logos.mark, palette: brand, styles: splashStyles(rootDir, { look, dark }, brand) });
};

/**
 * @param {LookCache} looks
 * @returns {Promise<import('vite').HtmlTagDescriptor[]>}  The look, for the app page
 */
const lookTagsOf = async (looks) => {
  const { look, dark } = await looks.get();
  return [{ tag: 'style', attrs: { 'data-brock-look': '' }, children: lookProperties(look, dark), injectTo: 'head' }];
};

/**
 * @param {{ rootDir: string, product: import('@drizztdourden08/brock-core/product').ProductInput }} opts
 * @returns {import('vite').Plugin}
 */
const splashPlugin = ({ rootDir, product }) => {
  const generated = !ownsSplashPage(rootDir);
  const looks = appLookCache(rootDir, product);
  return {
    name: 'brock-splash',
    configureServer: (server) => {
      looks.get().catch(() => undefined);
      if (!generated) return;
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== `/${SPLASH_PAGE}`) return next();
        splashPageOf(rootDir, looks).then((page) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(page);
        }, next);
        return undefined;
      });
    },
    transformIndexHtml: () => lookTagsOf(looks),
    async generateBundle() {
      if (generated) this.emitFile({ type: 'asset', fileName: SPLASH_PAGE, source: await splashPageOf(rootDir, looks) });
    },
  };
};

export { splashPlugin };
