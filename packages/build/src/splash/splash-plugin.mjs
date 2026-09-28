/* @layer tooling-scripts @kind logic */
import { basename } from 'node:path';
import { injectBootSplash } from './inject-boot-splash.mjs';
import { ownsSplashPage } from './owns-splash-page.mjs';
import { renderSplashPage } from './render-splash-page.mjs';
import { INDEX_PAGE, SPLASH_PAGE } from './splash.constants.mjs';
import { splashLook } from './splash-look.mjs';

/**
 * @param {{ rootDir: string, product: import('@drizztdourden08/brock-core/product').ProductInput }} opts
 * @returns {import('vite').Plugin}
 */
const splashPlugin = ({ rootDir, product }) => {
  const look = splashLook(product);
  const generated = !ownsSplashPage(rootDir);
  return {
    name: 'brock-splash',
    configureServer: (server) => {
      if (!generated) return;
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== `/${SPLASH_PAGE}`) return next();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(renderSplashPage(look));
        return undefined;
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => (basename(ctx.filename) === INDEX_PAGE ? injectBootSplash(html, look) : html),
    },
    generateBundle() {
      if (generated) this.emitFile({ type: 'asset', fileName: SPLASH_PAGE, source: renderSplashPage(look) });
    },
  };
};

export { splashPlugin };
