/* @layer tooling-scripts @kind logic */
import { isAbsolute, relative, resolve } from 'node:path';
import { SCREENS_DIR, WATCH_EVENTS } from './screen-conventions.constants.mjs';
import { writeScreensFile } from './write-screens.mjs';

/**
 * @param {{ rootDir: string }} opts
 * @returns {import('vite').Plugin}
 */
const screensPlugin = ({ rootDir }) => {
  const screensDir = resolve(rootDir, SCREENS_DIR);
  const inScreens = (file) => {
    const rel = relative(screensDir, resolve(file));
    return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
  };
  const regenerate = () => {
    writeScreensFile(rootDir);
  };
  return {
    name: 'brock-screens',
    buildStart: regenerate,
    configureServer: (server) => {
      for (const event of WATCH_EVENTS) server.watcher.on(event, (file) => { if (inScreens(file)) regenerate(); });
    },
  };
};

export { screensPlugin };
