/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { routeHtml } from './site-route-html.mjs';

const isRelativeBase = (base) => base === '' || base === './' || base === '.';

const isPage = (name) => /(^|\/)index\.html$/.test(name);

const pageNameOf = (bundle) => Object.keys(bundle).filter(isPage).sort((a, b) => a.length - b.length)[0] ?? 'index.html';

/**
 * @param {{ routes: { path: string, title: string, description: string | null }[] }} opts
 * @returns {import('vite').Plugin} a page per route
 */
const siteRoutesPlugin = ({ routes }) => {
  let relativeBase = false;
  return {
    name: 'brock-site-routes',
    apply: 'build',
    configResolved(config) {
      relativeBase = isRelativeBase(config.base);
    },
    writeBundle: {
      order: 'post',
      handler(options, bundle) {
        const outDir = options.dir;
        const html = readFileSync(join(outDir, pageNameOf(bundle)), 'utf8');
        routes.forEach((route) => {
          const file = join(outDir, ...route.path.split('/'), 'index.html');
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, routeHtml(html, route, relativeBase));
        });
      },
    },
  };
};

export { siteRoutesPlugin };
