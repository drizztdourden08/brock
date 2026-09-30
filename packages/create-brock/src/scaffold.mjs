/* @layer tooling-scripts @kind logic */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, join, relative } from 'node:path';
import {
  appendModuleId, findWorkspaceRoot, installLauncher, installPeers, launcherName, syncApp, BROCK_VERSION, MANAGED_FILES,
} from '@drizztdourden08/brock-build';
import { finishPlatforms } from './finish-platforms.mjs';
import { initRepository } from './git-init.mjs';
import { applyDependencies } from './local-links.mjs';
import { writePnpmFiles } from './pnpm-files.mjs';
import { writePortBase } from './port-base.mjs';
import { preparePlatforms } from './prepare-platforms.mjs';
import { applyIdentity } from './substitute.mjs';
import { templateModules } from './template-modules.mjs';
import { copyTemplate, isEmptyDir, locateTemplate } from './template.mjs';

/**
 * @typedef {object} ScaffoldPlan
 * @property {string} targetDir
 * @property {import('./identity.mjs').Identity} identity
 * @property {string[]} modules
 * @property {string[]} targets platform ids and bundles
 * @property {string | null} local
 * @property {string | null} tessera
 * @property {boolean} install
 */

const recordModules = (targetDir, modules) => {
  if (!modules.length) return;
  const file = join(targetDir, 'brock.config.ts');
  let source = readFileSync(file, 'utf8');
  for (const id of modules) source = appendModuleId(source, id);
  writeFileSync(file, source, 'utf8');
};

const runInstall = (targetDir) => {
  const isWindows = process.platform === 'win32';
  const result = spawnSync(isWindows ? 'pnpm.cmd' : 'pnpm', ['install'], {
    cwd: targetDir,
    stdio: 'inherit',
    shell: isWindows,
  });
  return result.status ?? 1;
};

/**
 * @param {string} targetDir
 * @param {string} id
 * @param {string | null} workspaceRoot
 * @returns {string | null} the repo command, or null for a workspace member
 */
const writeLauncher = (targetDir, id, workspaceRoot) => {
  if (workspaceRoot) return null;
  const name = launcherName(targetDir, `@${id}`);
  const { file, fields } = installLauncher(targetDir, name, false);
  console.log(`create-brock: wrote ${file}; package.json ${fields.join(', ')}`);
  return name;
};

/**
 * @param {ScaffoldPlan} plan
 * @param {{ missing: { id: string }[], later: string[] }} state unresolved modules, platform steps left
 * @param {string | null} command
 */
const printNextSteps = (plan, { missing, later }, command) => {
  const dir = relative(process.cwd(), plan.targetDir) || '.';
  const lines = [`\nCreated ${plan.identity.name} in ${dir} for ${plan.targets.join(', ')}\n`, 'Next:'];
  if (dir !== '.') lines.push(`  cd ${dir}`);
  if (!plan.install) lines.push(command ? `  pnpm install          (links the ${command} command)` : '  pnpm install');
  if (missing.length) lines.push(`  pnpm brock sync        (module packages to resolve: ${missing.map((m) => m.id).join(', ')})`);
  const run = command ?? 'pnpm brock';
  lines.push(
    ...later.map((line) => `  ${run} ${line}`),
    `  ${run} platform list                  (platform add and remove rewrite both workflows)`,
    `  ${run} launch main none --visible     (the app, hot reload)`,
    `  ${run} launch main none --review      (headless review: screenshots and a report)`,
    '  pnpm lint',
    '',
  );
  console.log(lines.join('\n'));
};

const removeRootOwnedFiles = (targetDir) => {
  for (const { target, rootOwned } of MANAGED_FILES) if (rootOwned) rmSync(join(targetDir, target), { force: true });
};

/**
 * @param {string} targetDir
 * @param {string[]} packages module packages whose peers were not known before install
 * @returns {Promise<number>} exit code
 */
const installPendingPeers = async (targetDir, packages) => {
  for (const name of packages) {
    const code = await installPeers(targetDir, name);
    if (code !== 0) return code;
  }
  return 0;
};

/**
 * @param {string} targetDir
 * @param {string | null} workspaceRoot
 * @param {{ modules: string[] }} config
 * @param {string[]} pending
 * @returns {Promise<{ code: number, sync: { missing: { id: string }[] } | null }>} the resync, when it ran
 */
const installThenResync = async (targetDir, workspaceRoot, config, pending) => {
  const code = runInstall(workspaceRoot ?? targetDir);
  if (code !== 0) return { code, sync: null };
  const peersCode = await installPendingPeers(targetDir, pending);
  if (peersCode !== 0) return { code: peersCode, sync: null };
  return { code: 0, sync: syncApp(targetDir, config, { onMissing: 'skip' }) };
};

/**
 * @param {ScaffoldPlan} plan
 * @returns {Promise<number>} exit code
 */
const scaffold = async (plan) => {
  const { targetDir, identity, local, tessera, install } = plan;
  if (!isEmptyDir(targetDir)) {
    console.error(`create-brock: ${targetDir} is not empty`);
    return 1;
  }
  const templateDir = locateTemplate();
  const modules = [...new Set([...templateModules(templateDir), ...plan.modules])];
  console.log(`create-brock: copying ${basename(templateDir)} template to ${targetDir}`);
  copyTemplate(templateDir, targetDir);
  applyIdentity(targetDir, identity);
  console.log(`create-brock: dev ports from ${writePortBase(targetDir, identity.id)} (product.ports.base)`);
  const { added, pending } = applyDependencies(targetDir, { modules, version: BROCK_VERSION, templateDir, local, tessera });
  if (added.length) console.log(`create-brock: added ${added.join(', ')} to dependencies`);
  const workspaceRoot = findWorkspaceRoot(targetDir);
  if (workspaceRoot) {
    console.log(`create-brock: workspace member of ${workspaceRoot}; the root keeps the lint configs, the catalog and .npmrc`);
    removeRootOwnedFiles(targetDir);
  }
  const pnpmFiles = writePnpmFiles(targetDir, templateDir, workspaceRoot);
  if (pnpmFiles.length) console.log(`create-brock: wrote ${pnpmFiles.join(', ')}`);
  recordModules(targetDir, modules);

  const config = { product: { id: identity.id, name: identity.name, appId: identity.appId, author: { name: identity.authorName } }, targets: plan.targets, modules };
  await preparePlatforms(targetDir, config);
  const sync = syncApp(targetDir, config, { onMissing: 'skip' });
  console.log(`create-brock: wrote ${sync.written.length} managed file(s)${workspaceRoot ? '' : ', the CI and release workflows among them'}`);
  const command = writeLauncher(targetDir, identity.id, workspaceRoot);

  const installed = install ? await installThenResync(targetDir, workspaceRoot, config, pending) : { code: 0, sync: null };
  if (installed.code !== 0) return installed.code;
  const later = await finishPlatforms(targetDir, config, install);
  const repository = initRepository(targetDir, identity);
  if (repository) console.log(`create-brock: ${repository}`);
  printNextSteps(plan, { missing: (installed.sync ?? sync).missing, later }, command);
  return 0;
};

export { scaffold };
