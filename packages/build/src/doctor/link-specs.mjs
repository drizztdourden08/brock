/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { findWorkspaceRoot } from '../workspace.mjs';
import { declaredSpecs, readAppPackage } from './app-package.mjs';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';
const LINK_SPEC = /^(link|file):/;
const YAML_LINK = /^\s+['"]?([^'":\s][^'":]*?)['"]?:\s*['"]?((?:link|file):[^'"\s#]+)['"]?\s*(?:#.*)?$/;

/**
 * @typedef {{ name: string, spec: string, source: string, target: string }} LinkSpec a dependency installed from a folder or a file
 */

/** @param {string} spec @param {string} base */
const targetOf = (spec, base) => resolve(base, spec.replace(LINK_SPEC, '').replace(/^\/\/\//, ''));

/** @param {Record<string, string>} specs @param {string} source @param {string} dir */
const fromSpecs = (specs, source, dir) =>
  Object.entries(specs)
    .filter(([, spec]) => typeof spec === 'string' && LINK_SPEC.test(spec))
    .map(([name, spec]) => ({ name, spec, source, target: targetOf(spec, dir) }));

/** @param {string} dir */
const fromWorkspaceFile = (dir) => {
  const file = join(dir, WORKSPACE_FILE);
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => YAML_LINK.exec(line))
    .filter(Boolean)
    .map((match) => ({ name: match[1], spec: match[2], source: WORKSPACE_FILE, target: targetOf(match[2], dir) }));
};

/**
 * @param {string} rootDir the app folder
 * @returns {LinkSpec[]} the link: and file: dependencies and pnpm overrides of the app and its workspace
 */
const linkSpecs = (rootDir) => {
  const workspace = findWorkspaceRoot(rootDir);
  const own = readAppPackage(rootDir);
  const specs = [...fromSpecs(declaredSpecs(own), 'package.json', rootDir), ...fromSpecs(own?.pnpm?.overrides ?? {}, 'package.json', rootDir)];
  const overrides = workspace ? fromSpecs(readAppPackage(workspace)?.pnpm?.overrides ?? {}, 'package.json', workspace) : [];
  const files = [rootDir, ...(workspace ? [workspace] : [])].flatMap(fromWorkspaceFile);
  return [...specs, ...overrides, ...files];
};

export { linkSpecs };
