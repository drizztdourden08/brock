/* @layer tooling-scripts @kind logic */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { IMPORT_STATEMENT, REACT_PACKAGE, SCREENS_CONFIG, SCREENS_DIR } from './screen-conventions.constants.mjs';

const DEFINE_SCREENS = 'const defineScreens = (config) => config;';

/** @param {string} source */
const withoutImports = (source) => source.replace(IMPORT_STATEMENT, (_line, typeOnly, from) => {
  if (!typeOnly && from !== REACT_PACKAGE) throw new Error(`it imports ${from}; the config imports only defineScreens from ${REACT_PACKAGE}`);
  return '';
});

/** @param {unknown} config */
const assertShape = (config) => {
  const buckets = /** @type {{ buckets?: unknown }} */ (config ?? {}).buckets;
  if (!Array.isArray(buckets) || buckets.some((bucket) => typeof bucket?.id !== 'string')) throw new Error('buckets must be a list of { id, title, icon, menu }');
  if (typeof (/** @type {{ home?: unknown }} */ (config).home) !== 'string') throw new Error('home must name a bucket');
  return /** @type {{ buckets: { id: string }[], home: string, settings?: { bucket: string } }} */ (config);
};

/**
 * @param {string} rootDir
 * @returns {Promise<{ buckets: { id: string }[], home: string, settings?: { bucket: string } }>}
 */
const readScreensConfig = async (rootDir) => {
  const source = readFileSync(join(rootDir, SCREENS_DIR, SCREENS_CONFIG), 'utf8');
  const dir = mkdtempSync(join(tmpdir(), 'brock-screens-'));
  const file = join(dir, SCREENS_CONFIG);
  try {
    writeFileSync(file, `${DEFINE_SCREENS}\n${withoutImports(source)}`, 'utf8');
    const loaded = await import(pathToFileURL(file).href);
    return assertShape(loaded.default);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

export { readScreensConfig };
