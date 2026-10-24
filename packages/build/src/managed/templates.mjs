/* @layer tooling-scripts @kind config */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withAliasPaths } from '../build-options/tsconfig-alias-paths.mjs';
import { withCompilerOptions } from '../build-options/tsconfig-compiler-options.mjs';

const TEMPLATE_DIR = import.meta.dirname;

/**
 * @type {{ target: string, template: string, rootOwned?: boolean, unlessScript?: string, electronOnly?: boolean } []}
 */
const MANAGED_FILES = [
  { target: 'electron.vite.config.ts', template: 'electron.vite.config.ts.tmpl', electronOnly: true },
  { target: 'electron-builder.config.cjs', template: 'electron-builder.config.cjs.tmpl', electronOnly: true },
  { target: 'eslint.config.mjs', template: 'eslint.config.mjs.tmpl', rootOwned: true },
  { target: 'stylelint.config.mjs', template: 'stylelint.config.mjs.tmpl', rootOwned: true },
  { target: '.markdownlint-cli2.mjs', template: 'markdownlint-cli2.mjs.tmpl', rootOwned: true, unlessScript: 'lint:md' },
  { target: 'tsconfig.json', template: 'tsconfig.json.tmpl' },
];

const TSCONFIG = 'tsconfig.json';

const contentOf = (target, template, { aliases, compilerOptions }) => {
  const text = readFileSync(join(TEMPLATE_DIR, template), 'utf8').replace(/\r\n/g, '\n');
  return target === TSCONFIG ? withCompilerOptions(withAliasPaths(text, aliases), compilerOptions) : text;
};

/**
 * @param {Record<string, string>} [scripts] the app's package.json scripts
 * @returns {string[]} the managed files a workspace root keeps instead of the app
 */
const rootOwnedTargets = (scripts = {}) =>
  MANAGED_FILES.filter(({ rootOwned, unlessScript }) => rootOwned && !(unlessScript && scripts[unlessScript])).map(({ target }) => target);

/**
 * @param {{ inWorkspace?: boolean, windowless?: boolean, scripts?: Record<string, string>, aliases?: Record<string, string>, compilerOptions?: Record<string, unknown> }} [opts] scripts: the app's package.json scripts; tsconfig additions
 * @returns {{ path: string, content: string } []}  Root-relative path and the file body
 */
const renderManagedFiles = ({ inWorkspace = false, windowless = false, scripts, aliases, compilerOptions } = {}) =>
  MANAGED_FILES.filter(({ target, electronOnly }) => !(windowless && electronOnly) && !(inWorkspace && rootOwnedTargets(scripts).includes(target))).map(({ target, template }) => ({
    path: target,
    content: contentOf(target, template, { aliases, compilerOptions }),
  }));

export { MANAGED_FILES, renderManagedFiles, rootOwnedTargets };
