/* @layer tooling-scripts @kind logic */
import { ensureSynced } from '../freshness/ensure-synced.mjs';
import { bundleAppHelperScripts } from '../helper-scripts/bundle-helper-scripts.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { packageServer } from '../packaging/server/package-server.mjs';
import { appShape } from '../platforms/server/app-shape.mjs';
import { bundleServer, watchServer } from '../platforms/server/bundle-server.mjs';
import { archesFromFlag } from '../platforms/server/server-options.mjs';
import { DIST_SERVER } from '../platforms/server/server.constants.mjs';
import { runInherit } from '../run.mjs';
import { SERVER_MODES, SERVER_USAGE } from './platform.constants.mjs';

/**
 * @param {string} rootDir the app folder
 * @param {string} label the command, for the messages
 * @returns {Promise<import('../config.mjs').BrockConfig | null>} the config once synced, or null after a problem
 */
const prepareServer = async (rootDir, label) => {
  const problem = await ensureSynced(rootDir, label);
  if (problem) {
    console.error(`${label}: ${problem}`);
    return null;
  }
  const config = await loadBrockConfig(rootDir);
  if (appShape(rootDir).windowless && !(await bundleAppHelperScripts(rootDir, config, label))) return null;
  return config;
};

const devServer = async (rootDir, config, label, passthrough) => {
  const watcher = await watchServer(rootDir, config, label);
  if (!watcher) return 1;
  const code = await runInherit(process.execPath, ['--watch', DIST_SERVER, ...passthrough], { cwd: rootDir }).catch(() => 1);
  await watcher.close();
  return code;
};

const messageOf = (error) => (error instanceof Error ? error.message : String(error));

const reportPackage = (result, label) => {
  const files = [...result.tarballs, ...result.debs];
  console.log(`${label}: packed ${result.version} into release/server:`);
  for (const file of files) console.log(`  ${file}`);
  console.log(`  ${result.dockerDir}${result.image ? `  (docker build -t ${result.image}:${result.version} ${result.dockerDir})` : ''}`);
};

const packServer = async (rootDir, config, label, { arch, deb }) => {
  try {
    const arches = arch ? archesFromFlag(arch) : undefined;
    if (!(await bundleServer(rootDir, config, label))) return 1;
    reportPackage(await packageServer({ rootDir, config, arches, deb }), label);
    return 0;
  } catch (error) {
    console.error(`${label}: ${messageOf(error)}`);
    return 1;
  }
};

/**
 * @param {{ rootDir: string, args?: string[], passthrough?: string[], arch?: string, deb?: boolean }} ctx
 * @returns {Promise<number>} exit code
 */
const runServer = async ({ rootDir, args = [], passthrough = [], arch, deb = false }) => {
  const [mode] = args;
  if (!SERVER_MODES.has(mode)) {
    console.error(SERVER_USAGE);
    return 1;
  }
  const label = `brock server ${mode}`;
  if (!appShape(rootDir).server) {
    console.error(`${label}: add server to targets in brock.config.ts, then run brock sync.`);
    return 1;
  }
  const config = await prepareServer(rootDir, label);
  if (!config) return 1;
  if (mode === 'dev') return devServer(rootDir, config, label, passthrough);
  if (mode === 'package') return packServer(rootDir, config, label, { arch, deb });
  return (await bundleServer(rootDir, config, label)) ? 0 : 1;
};

export { runServer };
