/* @layer tooling-scripts @kind logic */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Copies the newest build under every Archipelago version and writes the builds.json index beside them.
 * @param {object} kit The loaded client kit
 * @param {{ publicDir: string, moduleName: string, versions: string[] }} target
 * @param {{ bytes: Buffer, index: any }} built
 */
const writePublicBuilds = (kit, target, built) => {
  const { publicDir, moduleName, versions } = target;
  rmSync(publicDir, { recursive: true, force: true });
  for (const apVersion of versions) {
    mkdirSync(join(publicDir, apVersion), { recursive: true });
    writeFileSync(join(publicDir, apVersion, `${moduleName}.apworld`), built.bytes);
  }
  writeFileSync(join(publicDir, 'builds.json'), kit.serializeApworldIndex(built.index));
};

export { writePublicBuilds };
