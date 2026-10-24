/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { readYamlScalar } from '../yaml/yaml-scalar.mjs';
import { npm, scopeRegistry } from './npm-view.mjs';
import { REACT_PACKAGE, TESSERA_PACKAGE, WORKSPACE_FILE } from './upgrade.constants.mjs';

const CATALOG_LINE = new RegExp(String.raw`^[ \t]+['"]?${TESSERA_PACKAGE.replace('/', String.raw`\/`)}['"]?:[ \t]*(\S.*?)[ \t]*$`, 'm');

const testedRange = (checkout) => {
  const file = join(checkout, WORKSPACE_FILE);
  const spec = existsSync(file) ? CATALOG_LINE.exec(readFileSync(file, 'utf8'))?.[1] : undefined;
  return spec === undefined ? null : readYamlScalar(spec);
};

const fromCheckout = (checkout) => {
  const tested = testedRange(checkout);
  if (tested) return tested;
  const peers = jsonFile(join(checkout, 'packages', 'react', 'package.json')).read()?.peerDependencies;
  return typeof peers?.[TESSERA_PACKAGE] === 'string' ? peers[TESSERA_PACKAGE] : null;
};

const fromRegistry = (target, cwd) => {
  const result = npm(['view', `${REACT_PACKAGE}@${target}`, 'peerDependencies', '--json', `--registry=${scopeRegistry(cwd)}`, '--fetch-retries=0'], cwd);
  if (result.status !== 0) return null;
  try {
    const peers = JSON.parse(result.stdout || '{}');
    return typeof peers[TESSERA_PACKAGE] === 'string' ? peers[TESSERA_PACKAGE] : null;
  } catch {
    return null;
  }
};

/**
 * @param {{ target: string, checkout: string | null }} plan
 * @param {string} cwd the app checkout, whose .npmrc names the registry
 * @returns {string | null} the Tessera range an app should follow: the version a Brock checkout is tested on (its catalog), else brock-react's peer range, or null
 */
const tesseraRange = (plan, cwd) => (plan.checkout ? fromCheckout(plan.checkout) : fromRegistry(plan.target, cwd));

export { tesseraRange };
