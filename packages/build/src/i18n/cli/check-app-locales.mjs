/* @layer tooling-scripts @kind logic */
import { cliResult } from './cli-result.mjs';
import { loadAppLocales } from './load-app-locales.mjs';
import { tagReport } from './tag-report.mjs';
import { unusedKeys } from './unused-keys.mjs';

const unusedWarnings = (rootDir, app) => unusedKeys({ rootDir, baseFiles: app.baseFiles, dynamicKeys: app.dynamicKeys })
  .map((key) => `${key} is in the base and no 'ns:key' use in src reads it; remove it or list a dynamicKeys glob`);

/**
 * @param {{ rootDir: string, locale?: string }} input the app and one tag, or all
 * @returns {import('./cli-result.mjs').CliResult} per tag findings; errors set exit 1
 */
const checkAppLocales = ({ rootDir, locale }) => {
  const app = loadAppLocales(rootDir);
  if (locale && !app.tags.includes(locale)) return cliResult({ errors: [`no src/locales/${locale} folder; create it with brock i18n add ${locale}`] });
  const reports = (locale ? [locale] : app.tags).map((tag) => tagReport({ files: app.files, baseFiles: app.baseFiles, base: app.base, tag }));
  return cliResult({
    errors: [...app.findings, ...reports.flatMap((report) => report.errors)],
    warnings: [...reports.flatMap((report) => report.warnings), ...(locale ? [] : unusedWarnings(rootDir, app))],
    lines: [`brock i18n check: ${app.tags.length} tag(s), base ${app.base}`],
  });
};

export { checkAppLocales };
