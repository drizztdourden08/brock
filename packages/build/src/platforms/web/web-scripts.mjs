/* @layer tooling-scripts @kind logic */
import { addPackageEntries } from '../scaffold/add-package-entries.mjs';
import { WEB_SCRIPTS } from './web.constants.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} build:web and dev:web in package.json
 */
const webScripts = () => ({
  name: 'web scripts',
  phase: 'files',
  run: (ctx) => {
    const added = addPackageEntries(ctx.rootDir, { scripts: WEB_SCRIPTS });
    return added.length ? { status: 'done', detail: added.join(', ') } : { status: 'skipped', detail: 'already in package.json' };
  },
});

export { webScripts };
