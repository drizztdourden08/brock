/* @layer tooling-scripts @kind config */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withAliasPaths } from '../build-options/tsconfig-alias-paths.mjs';
import { withCompilerOptions } from '../build-options/tsconfig-compiler-options.mjs';

const TEMPLATE_DIR = import.meta.dirname;

/**
 * @type {{ target: string, template: string, rootOwned?: boolean } []}
 */
const MANAGED_FILES = [
  { target: 'electron.vite.config.ts', template: 'electron.vite.config.ts.tmpl' },
  { target: 'electron-builder.config.cjs', template: 'electron-builder.config.cjs.tmpl' },
  { target: 'eslint.config.mjs', template: 'eslint.config.mjs.tmpl', rootOwned: true },
  { target: 'stylelint.config.mjs', template: 'stylelint.config.mjs.tmpl', rootOwned: true },
  { target: '.markdownlint-cli2.mjs', template: 'markdownlint-cli2.mjs.tmpl', rootOwned: true },
  { target: 'tsconfig.json', template: 'tsconfig.json.tmpl' },
];

const TSCONFIG = 'tsconfig.json';

const contentOf = (target, template, { aliases, compilerOptions }) => {
  const text = readFileSync(join(TEMPLATE_DIR, template), 'utf8').replace(/\r\n/g, '\n');
  return target === TSCONFIG ? withCompilerOptions(withAliasPaths(text, aliases), compilerOptions) : text;
};

/**
 * @param {{ inWorkspace?: boolean, aliases?: Record<string, string>, compilerOptions?: Record<string, unknown> }} [opts] tsconfig additions
 * @returns {{ path: string, content: string } []}  Root-relative path and the file body
 */
const renderManagedFiles = ({ inWorkspace = false, aliases, compilerOptions } = {}) =>
  MANAGED_FILES.filter(({ rootOwned }) => !(inWorkspace && rootOwned)).map(({ target, template }) => ({
    path: target,
    content: contentOf(target, template, { aliases, compilerOptions }),
  }));

export { MANAGED_FILES, renderManagedFiles };
