/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DESIGN_DIR } from '../../tessera/tessera.constants.mjs';
import { DESIGN_KNIP } from './design.constants.mjs';

/**
 * @param {string} repoRoot
 * @returns {string[]} knip.json when it gained the workspace
 */
const knipWorkspace = (repoRoot) => {
  const file = join(repoRoot, 'knip.json');
  if (!existsSync(file)) return [];
  const knip = JSON.parse(readFileSync(file, 'utf8'));
  if (!knip.workspaces || knip.workspaces[DESIGN_DIR]) return [];
  writeFileSync(file, `${JSON.stringify({ ...knip, workspaces: { ...knip.workspaces, [DESIGN_DIR]: DESIGN_KNIP } }, null, 2)}\n`, 'utf8');
  return [file];
};

export { knipWorkspace };
