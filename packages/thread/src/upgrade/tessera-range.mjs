/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { npm, scopeRegistry } from './npm-view.mjs';
import { REACT_PACKAGE, TESSERA_PACKAGE } from './upgrade.constants.mjs';

const fromCheckout = (checkout) => {
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
 * @returns {string | null} brock-react's Tessera peer range, or null
 */
const tesseraRange = (plan, cwd) => (plan.checkout ? fromCheckout(plan.checkout) : fromRegistry(plan.target, cwd));

export { tesseraRange };
