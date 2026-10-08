/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { BUILDERS, LINUX_CONFIG_ENV, LINUX_CONFIG_FOLDER, MACHINE_DEFAULTS, SECRET_KEY } from './linux.constants.mjs';

/**
 * @typedef {object} LinuxMachine
 * @property {string} file the settings file it came from
 * @property {string} vmName the VirtualBox VM name
 * @property {string} host
 * @property {string} user
 * @property {number | null} port
 * @property {string | null} identityFile null: the ssh agent and default keys
 * @property {'vm' | 'wsl'} builder where the app builds
 * @property {string} wslDistro
 */

/**
 * @param {string} workspaceName
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string} the per-machine settings file, outside every repo
 */
const machineFile = (workspaceName, env = process.env) => env[LINUX_CONFIG_ENV] ?? join(homedir(), ...LINUX_CONFIG_FOLDER, `${workspaceName}.json`);

const assertNoSecret = (value, file, path = '') => {
  if (!value || typeof value !== 'object') return;
  for (const [key, inner] of Object.entries(value)) {
    if (SECRET_KEY.test(key)) throw new Error(`${file}: "${path}${key}" looks like a password or a secret. Brock never stores one: remove it and use an SSH key.`);
    assertNoSecret(inner, file, `${path}${key}.`);
  }
};

const text = (value, key, file) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${file}: "${key}" must be set. Run linux init to see the fields.`);
  return value.trim();
};

const portOf = (value, file) => {
  if (value === undefined || value === null) return null;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`${file}: "port" must be a port number.`);
  return port;
};

const optional = (value, fallback) => (typeof value === 'string' && value ? value : fallback);

/**
 * @param {Record<string, unknown>} raw the parsed settings
 * @param {string} file
 * @returns {LinuxMachine}
 */
const parseMachine = (raw, file) => {
  assertNoSecret(raw, file);
  const builder = raw.builder ?? MACHINE_DEFAULTS.builder;
  if (!BUILDERS.includes(builder)) throw new Error(`${file}: "builder" must be one of ${BUILDERS.join(', ')}.`);
  return {
    file,
    vmName: text(raw.vmName, 'vmName', file),
    host: text(raw.host, 'host', file),
    user: text(raw.user, 'user', file),
    port: portOf(raw.port, file),
    identityFile: optional(raw.identityFile, null),
    builder,
    wslDistro: optional(raw.wslDistro, MACHINE_DEFAULTS.wslDistro),
  };
};

/**
 * @param {string} workspaceName
 * @returns {LinuxMachine}
 */
const loadMachine = (workspaceName) => {
  const file = machineFile(workspaceName);
  if (!existsSync(file)) throw new Error(`No VM settings for this machine at ${file}. Run ${workspaceName} linux init.`);
  return parseMachine(JSON.parse(readFileSync(file, 'utf8')), file);
};

export { machineFile, parseMachine, loadMachine };
