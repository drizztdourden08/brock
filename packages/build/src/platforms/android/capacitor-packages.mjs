/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { addJsonListEntries } from '../scaffold/add-json-list-entries.mjs';
import { addPackageEntries } from '../scaffold/add-package-entries.mjs';
import { allowBuiltDependency } from '../scaffold/allow-built-dependency.mjs';
import { BUILT_DEPENDENCY, CAPACITOR_DEPENDENCIES, CAPACITOR_DEV_DEPENDENCIES } from './android.constants.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} Capacitor in package.json, knip told they load from mobile/
 */
const capacitorPackages = () => ({
  name: 'Capacitor packages',
  phase: 'files',
  run: (ctx) => {
    const added = addPackageEntries(ctx.rootDir, { dependencies: CAPACITOR_DEPENDENCIES, devDependencies: CAPACITOR_DEV_DEPENDENCIES });
    addJsonListEntries(join(ctx.rootDir, 'knip.json'), 'ignoreDependencies', [...Object.keys(CAPACITOR_DEPENDENCIES), ...Object.keys(CAPACITOR_DEV_DEPENDENCIES)]);
    const built = allowBuiltDependency(ctx.rootDir, BUILT_DEPENDENCY);
    if (!added.length && !built) return { status: 'skipped', detail: 'already in package.json' };
    return { status: 'done', detail: `added ${added.join(', ') || `${BUILT_DEPENDENCY} to onlyBuiltDependencies`}`, install: true };
  },
});

export { capacitorPackages };
