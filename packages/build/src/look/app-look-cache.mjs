/* @layer tooling-scripts @kind logic */
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE } from '../config.mjs';
import { loadBrockConfig } from '../load-config.mjs';
import { appLook } from './app-look.mjs';
import { lookFiles } from './look-files.mjs';

const stampOf = (files) => files.map((file) => {
  try {
    return `${file}@${statSync(file).mtimeMs}`;
  } catch {
    return `${file}@-`;
  }
}).join('|');

const readProduct = async (rootDir, version) => (await loadBrockConfig(rootDir, { version })).product;

/**
 * @typedef {Awaited<ReturnType<typeof appLook>>} AppLook
 * @typedef {{ load?: typeof appLook, reload?: (rootDir: string, version: string) => Promise<import('@drizztdourden08/brock-core/product').ProductInput> }} AppLookCacheOptions
 */

/**
 * @param {string} rootDir  The app root
 * @param {import('@drizztdourden08/brock-core/product').ProductInput} product  as brock.config held it at first
 * @param {AppLookCacheOptions} [options]  test doubles for appLook and brock.config
 * @returns {{ get: () => Promise<AppLook> }}  appLook, again once brock.config or a file it reads changed
 */
const appLookCache = (rootDir, product, { load = appLook, reload = readProduct } = {}) => {
  const configFile = [join(rootDir, CONFIG_FILE)];
  let current = product;
  let configStamp = stampOf(configFile);
  let done = null;
  let pending = null;

  const refresh = async () => {
    const stamp = stampOf(configFile);
    if (stamp !== configStamp) {
      current = await reload(rootDir, stamp);
      configStamp = stamp;
    }
    const files = lookFiles(rootDir, current);
    const filesStamp = stampOf(files);
    return { files, stamp: filesStamp, look: await load(rootDir, current) };
  };

  const get = () => {
    if (done && stampOf(done.files) === done.stamp) return Promise.resolve(done.look);
    pending ??= refresh()
      .then((entry) => {
        done = entry;
        return entry.look;
      })
      .finally(() => { pending = null; });
    return pending;
  };

  return { get };
};

export { appLookCache };
