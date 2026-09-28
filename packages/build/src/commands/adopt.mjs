/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { OWN_PACKAGE } from '../modules/sync.mjs';
import { installLauncher } from '../launcher/install-launcher.mjs';
import { launcherName } from '../launcher/launcher-name.mjs';
import { knipJson } from './knip-config.mjs';
import { THREAD, workspaceConfig } from './workspace-config.mjs';

const LINT_CONFIG = '@drizztdourden08/brock-lint-config';
const BUILD = '@drizztdourden08/brock-build';
const TOOLING_PACKAGES = { [LINT_CONFIG]: 'packages/lint-config', [BUILD]: 'packages/build', [THREAD]: 'packages/thread' };
const TOOL_DEPS = { knip: '^5.65.0', jscpd: '^4.0.5' };

const scopeOf = (pkg, explicit) => {
  if (explicit) return explicit.startsWith('@') ? explicit : `@${explicit}`;
  const name = pkg.name ?? '';
  return name.startsWith('@') ? name.split('/')[0] : `@${name.replace(/[^a-z0-9-]/gi, '-').toLowerCase() || 'app'}`;
};

const FILES = (scope, rootDir) => ({
  'brock.workspace.mjs': workspaceConfig(rootDir, scope.replace(/^@/, '')),
  'eslint.config.mjs': `/* @layer root-config @kind config */
import { brockEslint } from '${LINT_CONFIG}';

export default brockEslint({});
`,
  'stylelint.config.mjs': `/* @layer root-config @kind config */
import { brockStylelint } from '${LINT_CONFIG}/stylelint';

export default brockStylelint({ uiGlobs: ['**/src/**/*.css'], tokenGlobs: ['**/src/**/theme.css', '**/tokens/**/*.css'] });
`,
  '.markdownlint-cli2.mjs': `/* @layer root-config @kind config */
import { brockMarkdownlint } from '${LINT_CONFIG}/markdownlint';

export default brockMarkdownlint();
`,
  'knip.json': knipJson(rootDir),
  '.jscpd.json': `{
  "threshold": 0,
  "minTokens": 50,
  "minLines": 5,
  "format": ["typescript", "tsx", "javascript", "css"],
  "ignore": ["**/node_modules/**", "**/dist/**", "**/out/**", "**/release/**", "**/.brock/**", "**/.user-data/**", "**/fonts/**", ".worktrees/**"],
  "gitignore": true,
  "reporters": ["console"],
  "absolute": false
}
`,
  'pnpm-workspace.yaml': `packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
catalog: {}
onlyBuiltDependencies:
  - electron
  - esbuild
`,
  '.npmrc': `auto-install-peers=true
dedupe-peer-dependents=true
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*stylelint*
public-hoist-pattern[]=*markdownlint*
public-hoist-pattern[]=typescript
`,
  'brock.scope': `${scope}\n`,
});

const NEVER_OVERWRITE = new Set(['pnpm-workspace.yaml', '.npmrc']);

const SCRIPTS = {
  lint: 'eslint . && stylelint "**/*.css" --ignore-path .gitignore --allow-empty-input && brock prose && knip && jscpd .',
  'lint:md': 'markdownlint-cli2',
  structure: 'brock structure --check',
  prose: 'brock prose',
  deadcode: 'knip',
  duplicates: 'jscpd .',
};

/**
 * @param {string} rootDir
 * @param {string} scope
 * @param {boolean} force
 * @returns {{ written: string[], kept: string[] }}
 */
const writeConfigFiles = (rootDir, scope, force) => {
  const written = [];
  const kept = [];
  for (const [name, content] of Object.entries(FILES(scope, rootDir))) {
    const target = join(rootDir, name);
    if (existsSync(target) && (!force || NEVER_OVERWRITE.has(name))) { kept.push(name); continue; }
    writeFileSync(target, content, 'utf8');
    written.push(name);
  }
  return { written, kept };
};

/**
 * @param {string} rootDir
 * @param {string | undefined} local
 * @returns {(folder: string) => string}
 */
const toolingSpecFor = (rootDir, local) => {
  if (!local) return () => `^${OWN_PACKAGE.version}`;
  if (resolve(local) === resolve(rootDir)) return () => 'workspace:*';
  return (folder) => `link:${resolve(local, folder).replace(/\\/g, '/')}`;
};

/**
 * @param {Record<string, any>} pkg
 * @param {{ rootDir: string, local?: string, force: boolean }} ctx
 */
const addDevDependencies = (pkg, { rootDir, local, force }) => {
  pkg.devDependencies = pkg.devDependencies ?? {};
  const specFor = toolingSpecFor(rootDir, local);
  for (const [name, folder] of Object.entries(TOOLING_PACKAGES)) {
    if (!pkg.devDependencies[name] || force) pkg.devDependencies[name] = specFor(folder);
  }
  for (const [name, spec] of Object.entries(TOOL_DEPS)) pkg.devDependencies[name] ??= spec;
};

const addTooling = (pkg, ctx) => {
  addDevDependencies(pkg, ctx);
  pkg.scripts = pkg.scripts ?? {};
  for (const [name, command] of Object.entries(SCRIPTS)) if (!pkg.scripts[name]) pkg.scripts[name] = command;
  if (pkg.workspaces) {
    delete pkg.workspaces;
    console.log('brock adopt: removed package.json#workspaces; pnpm-workspace.yaml lists the packages now.');
  }
};

/**
 * @param {string} scope
 * @param {{ written: string[], kept: string[] }} files
 * @param {{ name: string, fields: string[] }} launcher
 */
const printSummary = (scope, { written, kept }, { name, fields }) => {
  console.log(`brock adopt: scope ${scope}, command ${name}`);
  if (written.length) console.log(`  wrote ${written.join(', ')}`);
  if (kept.length) console.log(`  kept ${kept.join(', ')} (use --force to overwrite)`);
  console.log('  package.json: lint-config, brock-build and brock-thread dependencies; lint, lint:md, structure scripts');
  if (fields.length) console.log(`  package.json: ${fields.join(', ')} for the ${name} command`);
  console.log(`\nNext: pnpm install (links the ${name} command), then \`${name} structure --check\` and \`pnpm lint\`.`);
};

/**
 * @param {string} rootDir
 * @param {string} scope
 * @param {{ force: boolean, files: { written: string[], kept: string[] } }} opts
 * @returns {{ name: string, fields: string[] }}
 */
const addLauncher = (rootDir, scope, { force, files }) => {
  const name = launcherName(rootDir, scope);
  const { file, written, fields } = installLauncher(rootDir, name, force);
  (written ? files.written : files.kept).push(file);
  return { name, fields };
};

/**
 * @param {{ rootDir: string, scope?: string, local?: string, force?: boolean}} ctx
 * @returns {Promise<number>} exit code
 */
const runAdopt = async ({ rootDir, scope: explicitScope, local, force = false }) => {
  const pkgFile = join(rootDir, 'package.json');
  if (!existsSync(pkgFile)) {
    console.error(`brock adopt: no package.json in ${rootDir}`);
    return 1;
  }
  const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'));
  const scope = scopeOf(pkg, explicitScope);
  const files = writeConfigFiles(rootDir, scope, force);
  addTooling(pkg, { rootDir, local, force });
  writeFileSync(pkgFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  printSummary(scope, files, addLauncher(rootDir, scope, { force, files }));
  return 0;
};

export { runAdopt, scopeOf };
