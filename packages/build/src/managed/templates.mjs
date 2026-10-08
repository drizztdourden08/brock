/* @layer tooling-scripts @kind config */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withAliasPaths } from '../build-options/tsconfig-alias-paths.mjs';

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

const contentOf = (target, template, aliases) => {
  const text = readFileSync(join(TEMPLATE_DIR, template), 'utf8').replace(/\r\n/g, '\n');
  return target === TSCONFIG ? withAliasPaths(text, aliases) : text;
};

/**
 * @param {{ inWorkspace?: boolean, aliases?: Record<string, string> }} [opts] aliases join the tsconfig paths
 * @returns {{ path: string, content: string } []}  Root-relative path and the file body
 */
const renderManagedFiles = ({ inWorkspace = false, aliases } = {}) =>
  MANAGED_FILES.filter(({ rootOwned }) => !(inWorkspace && rootOwned)).map(({ target, template }) => ({
    path: target,
    content: contentOf(target, template, aliases),
  }));

export { MANAGED_FILES, renderManagedFiles };
