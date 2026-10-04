/* @layer tooling-scripts @kind logic */
import { isAbsolute, relative, resolve } from 'node:path';
import { WATCH_EVENTS } from './screens/screen-conventions.constants.mjs';

/**
 * @param {{ name: string, rootDir: string, dir: string, regenerate: (rootDir: string) => unknown }} opts
 * @returns {import('vite').Plugin} reruns on any change in dir
 */
const regeneratePlugin = ({ name, rootDir, dir, regenerate }) => {
  const watched = resolve(rootDir, dir);
  const inside = (file) => {
    const rel = relative(watched, resolve(file));
    return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
  };
  const run = () => {
    regenerate(rootDir);
  };
  return {
    name,
    buildStart: run,
    configureServer: (server) => {
      for (const event of WATCH_EVENTS) server.watcher.on(event, (file) => { if (inside(file)) run(); });
    },
  };
};

export { regeneratePlugin };
