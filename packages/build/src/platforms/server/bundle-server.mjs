/* @layer tooling-scripts @kind logic */
import { importFromApp } from '../../import-from-app.mjs';
import { serverViteConfig } from './server-vite-config.mjs';
import { DIST_SERVER } from './server.constants.mjs';

const messageOf = (error) => (error instanceof Error ? error.message : String(error));

/**
 * @param {string} rootDir the app folder
 * @param {import('../../config.mjs').BrockConfig} config brock.config.ts
 * @param {string} command the command, for the messages
 * @returns {Promise<boolean>} false when the bundle failed
 */
const bundleServer = async (rootDir, config, command) => {
  try {
    const vite = await importFromApp(rootDir, 'vite');
    await vite.build(serverViteConfig(rootDir, config));
    console.log(`${command}: built the server into ${DIST_SERVER}`);
    return true;
  } catch (error) {
    console.error(`${command}: ${messageOf(error)}`);
    return false;
  }
};

/**
 * @param {string} rootDir the app folder
 * @param {import('../../config.mjs').BrockConfig} config brock.config.ts
 * @param {string} command the command, for the messages
 * @returns {Promise<{ close: () => Promise<void> } | null>} the watcher once the first bundle is out, else null
 */
const watchServer = async (rootDir, config, command) => {
  try {
    const vite = await importFromApp(rootDir, 'vite');
    const base = serverViteConfig(rootDir, config);
    const watcher = await vite.build({ ...base, build: { ...base.build, watch: {} } });
    return await new Promise((resolve) => {
      let ready = false;
      watcher.on('event', (event) => {
        if (event.code === 'ERROR') {
          console.error(`${command}: ${messageOf(event.error)}`);
          if (!ready) watcher.close().then(() => resolve(null));
        }
        if (event.code === 'BUNDLE_END') {
          event.result.close();
          if (!ready) resolve(watcher);
          ready = true;
        }
      });
    });
  } catch (error) {
    console.error(`${command}: ${messageOf(error)}`);
    return null;
  }
};

export { bundleServer, watchServer };
