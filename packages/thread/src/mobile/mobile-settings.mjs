/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CONVENTION } from './mobile.constants.mjs';

/**
 * @param {string} base a folder that may hold capacitor.config.json
 * @returns {{ base: string, mobile: Record<string, unknown> } | null}
 */
const conventionAt = (base) => {
  const file = join(base, CONVENTION.config);
  if (!existsSync(file)) return null;
  const { appId, android } = JSON.parse(readFileSync(file, 'utf8'));
  const mobile = { dir: CONVENTION.dir, androidPath: android?.path, packageId: appId, webBuild: CONVENTION.webBuild, syncCommand: CONVENTION.syncCommand };
  return { base, mobile };
};

/**
 * @param {string} rootDir the main checkout
 * @param {{ name: string, mobile?: Record<string, unknown> }} workspace
 * @returns {{ base: string, mobile: Record<string, unknown> }} workspace mobile, else the capacitor.config.json
 */
const mobileSettings = (rootDir, workspace) => {
  if (workspace.mobile && typeof workspace.mobile === 'object') return { base: rootDir, mobile: workspace.mobile };
  const found = conventionAt(process.cwd()) ?? conventionAt(rootDir);
  if (found) return found;
  throw new Error(`This workspace has no mobile app. Run ${workspace.name} platform add android, or add mobile: { dir, webBuild, packageId } to brock.workspace.mjs.`);
};

export { mobileSettings };
