/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cargoRoot } from './cargo-root.mjs';

const WORKSPACE_FILE = 'brock.workspace.mjs';

const declaredGate = async (rootDir) => {
  const file = join(rootDir, WORKSPACE_FILE);
  if (!existsSync(file)) return undefined;
  return ((await import(pathToFileURL(file).href)).default ?? {}).gate;
};

/**
 * @param {string} rootDir a repo root that holds no Brock app
 * @returns {Promise<{ gate: object } | null>} the declared gate, an empty one for a Cargo.toml, or null
 */
const workspaceGate = async (rootDir) => {
  const gate = await declaredGate(rootDir);
  if (gate) return { gate };
  return cargoRoot(rootDir, {}) ? { gate: {} } : null;
};

export { workspaceGate };
