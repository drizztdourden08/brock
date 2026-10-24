/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fillTemplate } from '../../release/fill-template.mjs';
import { DIST_SERVER, SERVER_DIR } from '../../platforms/server/server.constants.mjs';
import { MODE_EXECUTABLE, MODE_FILE } from './server-packaging.constants.mjs';

/**
 * @param {{ rootDir: string, id: string, node: Buffer }} app the folder, the id and the node binary
 * @returns {{ path: string, mode: number, data: Buffer | string }[]} the tree that ships, under <id>/
 */
const stageServer = ({ rootDir, id, node }) => {
  const bundle = join(rootDir, DIST_SERVER);
  if (!existsSync(bundle)) throw new Error(`${DIST_SERVER} does not exist; run brock server build first.`);
  return [
    { path: `${id}/bin/${id}-server`, mode: MODE_EXECUTABLE, data: fillTemplate(SERVER_DIR, 'launcher.sh.tmpl', {}) },
    { path: `${id}/node/bin/node`, mode: MODE_EXECUTABLE, data: node },
    { path: `${id}/server/main.mjs`, mode: MODE_FILE, data: readFileSync(bundle) },
  ];
};

export { stageServer };
