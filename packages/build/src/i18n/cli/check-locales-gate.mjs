/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALES_DIR } from '../i18n.constants.mjs';
import { checkAppLocales } from './check-app-locales.mjs';

/**
 * @param {string} appDir the app root
 * @param {(line: string) => void} log where findings go
 * @returns {string[]} the failed step, empty when src/locales is absent or clean
 */
const checkLocalesGate = (appDir, log) => {
  if (!existsSync(join(appDir, LOCALES_DIR))) return [];
  log('brock gate: brock i18n check');
  const result = checkAppLocales({ rootDir: appDir });
  for (const error of result.errors) log(`  error: ${error}`);
  return result.code === 0 ? [] : ['brock i18n check'];
};

export { checkLocalesGate };
