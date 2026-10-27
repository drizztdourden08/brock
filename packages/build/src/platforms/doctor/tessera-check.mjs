/* @layer tooling-scripts @kind logic */
import { tesseraMismatch } from '../../freshness/tessera-mismatch.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const tesseraCheck = () => ({
  label: 'Tessera version',
  run: (ctx) => {
    if (!ctx.rootDir) return { status: 'skip', detail: 'no app folder' };
    const mismatch = tesseraMismatch(ctx.rootDir);
    if (!mismatch) return { status: 'ok', detail: 'matches what brock-react needs' };
    return { status: 'missing', detail: `brock-react ${mismatch.react} needs ${mismatch.range}, this app has ${mismatch.tessera}`, install: mismatch.command };
  },
});

export { tesseraCheck };
