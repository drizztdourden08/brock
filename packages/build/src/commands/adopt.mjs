/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { followBrockPin, keepCrossDriveLinks, linkSpec } from '@drizztdourden08/brock-thread';
import { scopeOf } from '@drizztdourden08/standards/structure';
import { OWN_PACKAGE } from '../modules/sync.mjs';
import { releaseAppDir } from '../release/release-app-dir.mjs';
import { releaseWorkflow } from '../release/release-workflow.mjs';
import { RELEASE_WORKFLOW_FILE } from '../release/workflows.constants.mjs';
import { installLauncher } from '../launcher/install-launcher.mjs';
import { launcherName } from '../launcher/launcher-name.mjs';
import { designPackageOf } from '../tessera/design-package-of.mjs';
import { tesseraConfigFor } from '../tessera/tessera-config-for.mjs';
import { TESSERA_CONFIG_FILE } from '../tessera/tessera.constants.mjs';
import { tokenGlobs } from '../tessera/token-globs.mjs';
import { ignoreGenerated } from './adopt-gitignore.mjs';
import { handWrittenSplash } from './hand-written-splash.mjs';
import { knipJson } from './knip-config.mjs';
import { THREAD, workspaceConfig } from './workspace-config.mjs';

const LINT_CONFIG = '@drizztdourden08/brock-lint-config';
const BUILD = '@drizztdourden08/brock-build';
const TOOLING_PACKAGES = { [LINT_CONFIG]: 'packages/lint-config', [BUILD]: 'packages/build', [THREAD]: 'packages/thread' };
const TOOL_DEPS = { knip: '^5.65.0', jscpd: '^4.0.5' };

const standardsFile = (path) => readFileSync(createRequire(import.meta.url).resolve(`@drizztdourden08/standards/${path}`), 'utf8');

const FILES = (scope, rootDir, local) => ({
  'brock.workspace.mjs': workspaceConfig(rootDir, scope.replace(/^@/, '')),
  'eslint.config.mjs': `/* @layer root-config @kind config */
import { brockEslint } from '${LINT_CONFIG}';

export default brockEslint({ presets: ['react-app'] });
`,
  'stylelint.config.mjs': `/* @layer root-config @kind config */
import { brockStylelint } from '${LINT_CONFIG}/stylelint';

export default brockStylelint({ uiGlobs: ['**/src/**/*.css'], tokenGlobs: [${tokenGlobs(rootDir).map((glob) => `'${glob}'`).join(', ')}] });
`,
  '.markdownlint-cli2.mjs': `/* @layer root-config @kind config */
import { brockMarkdownlint } from '${LINT_CONFIG}/markdownlint';

export default brockMarkdownlint();
`,
  'knip.json': knipJson(rootDir, { linked: Boolean(local) }),
  '.jscpd.json': standardsFile('jscpd/base.json'),
  'pnpm-workspace.yaml': `packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling/*'
catalog: {}
onlyBuiltDependencies:
  - electron
  - esbuild
`,
  '.npmrc': standardsFile('templates/npmrc'),
  'brock.scope': `${scope}\n`,
  [TESSERA_CONFIG_FILE]: `${JSON.stringify(tesseraConfigFor(rootDir, designPackageOf(rootDir, scope)), null, 2)}\n`,
  [RELEASE_WORKFLOW_FILE]: releaseWorkflow(releaseAppDir(rootDir)),
});

const NEVER_OVERWRITE = new Set(['pnpm-workspace.yaml', '.npmrc', TESSERA_CONFIG_FILE]);

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
 * @param {{ force: boolean, local?: string }} opts
 * @returns {{ written: string[], kept: string[] }}
 */
const writeConfigFiles = (rootDir, scope, { force, local }) => {
  const written = [];
  const kept = [];
  for (const [name, content] of Object.entries(FILES(scope, rootDir, local))) {
    const target = join(rootDir, name);
    if (existsSync(target) && (!force || NEVER_OVERWRITE.has(name))) { kept.push(name); continue; }
    mkdirSync(dirname(target), { recursive: true });
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
  return (folder) => linkSpec(resolve(local, folder));
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
  const files = writeConfigFiles(rootDir, scope, { force, local });
  if (ignoreGenerated(rootDir).length) files.written.push('.gitignore (generated outputs)');
  addTooling(pkg, { rootDir, local, force });
  const { pkg: pinned } = followBrockPin(pkg, OWN_PACKAGE.version);
  writeFileSync(pkgFile, `${JSON.stringify(pinned, null, 2)}\n`, 'utf8');
  if (keepCrossDriveLinks(rootDir).length) files.written.push('.npmrc and .gitattributes (links across drives)');
  printSummary(scope, files, addLauncher(rootDir, scope, { force, files }));
  for (const page of handWrittenSplash(rootDir)) console.log(`  ${page}: holds a hand-written boot splash or logo path. Brock owns the splash and the logos; remove them.`);
  return 0;
};

export { runAdopt };
