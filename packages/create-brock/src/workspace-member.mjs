/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { appScripts, rootOwnedTargets } from '@drizztdourden08/brock-build';

const ROOT_FILES = ['brock.workspace.mjs'];

const ROOT_DEV_DEPENDENCIES = ['@drizztdourden08/brock-thread', 'stylelint-config-standard'];

const rewriteJson = (file, change) => {
  if (!existsSync(file)) return;
  const json = JSON.parse(readFileSync(file, 'utf8'));
  change(json);
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
};

/**
 * @param {string} targetDir
 */
const dropRootOwned = (targetDir) => {
  const names = [...rootOwnedTargets(appScripts(targetDir)), ...ROOT_FILES];
  for (const name of names) rmSync(join(targetDir, name), { force: true });
  rewriteJson(join(targetDir, 'package.json'), (pkg) => {
    for (const name of ROOT_DEV_DEPENDENCIES) delete pkg.devDependencies?.[name];
  });
  rewriteJson(join(targetDir, 'knip.json'), (knip) => {
    knip.entry = knip.entry?.filter((entry) => !names.includes(entry));
  });
};

export { dropRootOwned };
