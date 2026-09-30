/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { addJsonListEntries } from '../scaffold/add-json-list-entries.mjs';
import { ensureLines } from '../scaffold/ensure-lines.mjs';
import { GITIGNORE_LINES, JSCPD_IGNORE, PROSEIGNORE_LINE } from './android.constants.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} git, prose and jscpd leave the generated Android tree alone
 */
const mobileIgnores = () => ({
  name: 'ignore files for mobile/',
  phase: 'files',
  run: (ctx) => {
    const changed = [
      ...ensureLines(join(ctx.rootDir, '.gitignore'), GITIGNORE_LINES).map(() => '.gitignore'),
      ...ensureLines(join(ctx.rootDir, '.proseignore'), [PROSEIGNORE_LINE]).map(() => '.proseignore'),
      ...addJsonListEntries(join(ctx.rootDir, '.jscpd.json'), 'ignore', [JSCPD_IGNORE]).map(() => '.jscpd.json'),
    ];
    return changed.length ? { status: 'done', detail: [...new Set(changed)].join(', ') } : { status: 'skipped', detail: 'already listed' };
  },
});

export { mobileIgnores };
