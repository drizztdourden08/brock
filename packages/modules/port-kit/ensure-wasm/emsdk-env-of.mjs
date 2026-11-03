/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync } from 'node:fs';
import { delimiter, join } from 'node:path';

const versionsOf = (dir) => (existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort().reverse() : []);

const toolOf = (parent, binary, ...inside) => {
  const folder = versionsOf(parent).map((version) => join(parent, version, ...inside)).find((candidate) => existsSync(join(candidate, binary)));
  return folder ? { folder, binary: join(folder, binary) } : null;
};

const pathKeyOf = (env) => Object.keys(env).find((key) => key.toLowerCase() === 'path') ?? 'PATH';

/**
 * @param {string} dir
 * @param {NodeJS.ProcessEnv} [env]
 * @param {NodeJS.Platform} [platform]
 * @returns {NodeJS.ProcessEnv}
 */
const emsdkEnvOf = (dir, env = process.env, platform = process.platform) => {
  const windows = platform === 'win32';
  const node = toolOf(join(dir, 'node'), windows ? 'node.exe' : 'node', 'bin');
  const python = windows ? toolOf(join(dir, 'python'), 'python.exe') : null;
  const config = join(dir, '.emscripten');
  const key = pathKeyOf(env);
  const added = [dir, join(dir, 'upstream', 'emscripten'), node?.folder, python?.folder].filter((entry) => entry && existsSync(entry));
  return {
    ...env,
    EMSDK: dir,
    ...(node && { EMSDK_NODE: node.binary }),
    ...(python && { EMSDK_PYTHON: python.binary }),
    ...(existsSync(config) && { EM_CONFIG: config }),
    [key]: [...added, env[key]].filter(Boolean).join(delimiter),
  };
};

export { emsdkEnvOf };
