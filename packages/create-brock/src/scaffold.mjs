/* @layer tooling-scripts @kind logic */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, join, relative } from 'node:path';
import { appendModuleId, findWorkspaceRoot, installLauncher, launcherName, syncApp, BROCK_VERSION, MANAGED_FILES } from '@drizztdourden08/brock-build';
import { applyDependencies } from './local-links.mjs';
import { writePnpmFiles } from './pnpm-files.mjs';
import { writeReleaseWorkflow } from './release-files.mjs';
import { applyIdentity } from './substitute.mjs';
import { copyTemplate, isEmptyDir, locateTemplate } from './template.mjs';

/**
 * @typedef {object} ScaffoldPlan
 * @property {string} targetDir
 * @property {import('./identity.mjs').Identity} identity
 * @property {string[]} modules
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
 * @param {ScaffoldPlan} plan @param {{ missing: { id: string }[] }} sync @param {string | null} command
 */
const printNextSteps = (plan, sync, command) => {
  const dir = relative(process.cwd(), plan.targetDir) || '.';
  const lines = [`\nCreated ${plan.identity.name} in ${dir}\n`, 'Next:'];
  if (dir !== '.') lines.push(`  cd ${dir}`);
  if (!plan.install) lines.push(command ? `  pnpm install          (links the ${command} command)` : '  pnpm install');
  if (command) lines.push(`${`  ${command} --version`.padEnd(23)} (the repo command; the first run offers to install Brock on this machine)`);
  if (sync.missing.length) lines.push(`  pnpm brock sync        (module packages to resolve: ${sync.missing.map((m) => m.id).join(', ')})`);
  lines.push('  pnpm lint', '  pnpm dev', '', 'Headless smoke test after a build:', '  pnpm build && pnpm start:headless -- --user-data=.user-data', '');
  console.log(lines.join('\n'));
};

const removeRootOwnedFiles = (targetDir) => {
  for (const { target, rootOwned } of MANAGED_FILES) if (rootOwned) rmSync(join(targetDir, target), { force: true });
};

/**
 * @param {ScaffoldPlan} plan
 * @param {string | null} workspaceRoot
 * @param {object} config
 * @returns {number} exit code
 */
const installThenResync = ({ targetDir, modules }, workspaceRoot, config) => {
  const code = runInstall(workspaceRoot ?? targetDir);
  if (code !== 0) return code;
  if (modules.length) syncApp(targetDir, config, { onMissing: 'skip' });
  return 0;
};

/**
 * @param {ScaffoldPlan} plan
 * @returns {Promise<number>} exit code
 */
const scaffold = async (plan) => {
  const { targetDir, identity, modules, local, tessera, install } = plan;
  if (!isEmptyDir(targetDir)) {
    console.error(`create-brock: ${targetDir} is not empty`);
    return 1;
  }
  const templateDir = locateTemplate();
  console.log(`create-brock: copying ${basename(templateDir)} template to ${targetDir}`);
  copyTemplate(templateDir, targetDir);
  applyIdentity(targetDir, identity);
  const added = applyDependencies(targetDir, { modules, version: BROCK_VERSION, local, tessera });
  if (added.length) console.log(`create-brock: added ${added.join(', ')} to dependencies`);
  const workspaceRoot = findWorkspaceRoot(targetDir);
  if (workspaceRoot) {
    console.log(`create-brock: workspace member of ${workspaceRoot}; the root keeps the lint configs, the catalog and .npmrc`);
    removeRootOwnedFiles(targetDir);
  }
  const pnpmFiles = writePnpmFiles(targetDir, templateDir, workspaceRoot);
  if (pnpmFiles.length) console.log(`create-brock: wrote ${pnpmFiles.join(', ')}`);
  const workflow = writeReleaseWorkflow(targetDir, workspaceRoot);
  if (workflow) console.log(`create-brock: wrote ${workflow}`);
  recordModules(targetDir, modules);

  const config = { product: { id: identity.id, name: identity.name, appId: identity.appId, author: { name: identity.authorName } }, targets: ['desktop'], modules };
  const sync = syncApp(targetDir, config, { onMissing: 'skip' });
  console.log(`create-brock: wrote ${sync.written.length} managed file(s)`);
  const command = writeLauncher(targetDir, identity.id, workspaceRoot);

  if (install) {
    const code = installThenResync(plan, workspaceRoot, config);
    if (code !== 0) return code;
  }
  printNextSteps(plan, sync, command);
  return 0;
};

export { scaffold };
