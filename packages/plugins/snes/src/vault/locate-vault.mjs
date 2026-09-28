/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const envVarFor = (name, vault) => vault.envVar ?? `${name.toUpperCase().replace(/-/g, '_')}_VAULT_DIR`;

const candidates = ({ main, name, vault }) => [
  process.env[envVarFor(name, vault)],
  vault.dir ? resolve(main, vault.dir) : null,
  resolve(main, '..', `${name}-vault`),
].filter(Boolean);

/**
 * @param {{ main: string, name: string, vault: { dir: string | null, envVar: string | null, treeDir: string } }} request
 * @returns {{ vaultDir: string, treeDir: string } | null}
 */
const locateVault = (request) => {
  const found = candidates(request).find((dir) => existsSync(join(dir, request.vault.treeDir)));
  return found ? { vaultDir: found, treeDir: join(found, request.vault.treeDir) } : null;
};

/**
 * @param {{ main: string, name: string, vault: { dir: string | null, envVar: string | null } }} request
 * @returns {string} where a vault was looked for
 */
const expectedVaultHint = ({ main, name, vault }) =>
  `Expected a checkout at ${resolve(main, '..', `${name}-vault`)}, or set ${envVarFor(name, vault)}.`;

export { expectedVaultHint, locateVault };
