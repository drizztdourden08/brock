/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { routeHtml } from './site-route-html.mjs';

const isRelativeBase = (base) => base === '' || base === './' || base === '.';

/**
 * @param {{ routes: { path: string, title: string, description: string | null }[] }} opts
 * @returns {import('vite').Plugin} a page per route
 */
const siteRoutesPlugin = ({ routes }) => {
  let outDir = '';
  let relativeBase = false;
  return {
    name: 'brock-site-routes',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
      relativeBase = isRelativeBase(config.base);
    },
    closeBundle: {
      order: 'post',
      handler() {
        const html = readFileSync(join(outDir, 'index.html'), 'utf8');
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
