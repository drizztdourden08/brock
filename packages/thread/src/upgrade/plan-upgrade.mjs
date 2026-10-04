/* @layer tooling-scripts @kind logic */
import { resolve } from 'node:path';
import { appDirs } from './app-dirs.mjs';
import { brockInstallOf } from './brock-install.mjs';
import { latestBrock } from './latest-brock.mjs';

const installOf = (rootDir) => {
  const installs = [rootDir, ...appDirs(rootDir)].map(brockInstallOf.read);
  return installs.find((install) => install.mode !== 'none') ?? installs[0];
};

const assertUpgradable = (install) => {
  if (install.mode === 'workspace') throw new Error('Brock comes from this workspace (workspace: specs), so it moves with the checkout. There is nothing to upgrade.');
  if (install.mode === 'none') throw new Error('package.json names no Brock package, so this is not a Brock app.');
};

const linkPlan = (install, local) => {
  const checkout = local ?? install.checkout;
  if (!checkout) throw new Error('Brock is linked, but no Brock checkout (packages/build) sits above the link. Relink it with --local <brockRepo>.');
  return { mode: 'link', current: install.pinned, target: brockInstallOf.checkoutVersion(checkout), checkout, relink: local !== null };
};

/**
 * @param {string} rootDir the app checkout
 * @param {string | undefined} requested a version given on the command line
 * @param {string | boolean | undefined} local --local, a Brock checkout to link
 * @returns {{ plan: import('./upgrade.type.mjs').UpgradePlan | null, offline: string | null }}
 */
const planUpgrade = (rootDir, requested, local) => {
  const install = installOf(rootDir);
  assertUpgradable(install);
  const localDir = typeof local === 'string' ? resolve(local) : null;
  if (localDir || install.mode === 'link') return { plan: linkPlan(install, localDir), offline: null };
  const registryPlan = (target) => ({ mode: 'registry', current: install.pinned, target, checkout: null, relink: false });
  if (requested) return { plan: registryPlan(requested.replace(/^v/, '')), offline: null };
  const latest = latestBrock(rootDir);
  if (latest.version) return { plan: registryPlan(latest.version), offline: null };
  return { plan: null, offline: `Could not read the newest Brock from ${latest.registry} (${latest.problem}). Check the network and the npm login, then retry.` };
};

export { planUpgrade };
