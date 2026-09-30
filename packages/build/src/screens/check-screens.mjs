/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { readScreensConfig } from './read-screens-config.mjs';
import { scanScreens } from './scan-screens.mjs';
import { SCREENS_CONFIG, SCREENS_DIR } from './screen-conventions.constants.mjs';
import { searchFindings } from './search/search-findings.mjs';

const CONFIG_PATH = `${SCREENS_DIR}/${SCREENS_CONFIG}`;

/**
 * @param {{ buckets: { id: string }[], home: string, settings?: { bucket: string } }} config
 * @param {string[]} folders
 * @returns {string[]}
 */
const configFindings = (config, folders) => {
  const declared = config.buckets.map((bucket) => bucket.id);
  const settings = config.settings?.bucket ?? config.home;
  return [
    ...folders.filter((id) => !declared.includes(id)).map((id) => `${SCREENS_DIR}/${id}: bucket folder not declared in ${SCREENS_CONFIG}; add { id: '${id}', ... } to buckets`),
    ...declared.filter((id) => !folders.includes(id)).map((id) => `${CONFIG_PATH}: bucket "${id}" has no folder ${SCREENS_DIR}/${id}`),
    ...(declared.includes(config.home) ? [] : [`${CONFIG_PATH}: home "${config.home}" is not a declared bucket`]),
    ...(declared.includes(settings) ? [] : [`${CONFIG_PATH}: settings.bucket "${settings}" is not a declared bucket`]),
  ];
};

/**
 * @param {string} rootDir the app root
 * @returns {Promise<string[]>}
 */
const checkScreens = async (rootDir) => {
  if (!existsSync(join(rootDir, CONFIG_PATH))) return [];
  const { files, findings: layout, buckets } = scanScreens(rootDir);
  const findings = [...layout, ...searchFindings(rootDir, files)];
  try {
    return [...findings, ...configFindings(await readScreensConfig(rootDir), buckets)];
  } catch (error) {
    return [...findings, `${CONFIG_PATH}: ${error instanceof Error ? error.message : String(error)}`];
  }
};

export { checkScreens };
