/* @layer tooling-scripts @kind logic */
import { copyBrandIcons } from '../../icons/copy-brand-icons.mjs';

/**
 * @returns {import('../platform.type.mjs').ScaffoldStep} the Tessera brand set in build/ and public/logos
 */
const brandIcons = () => ({
  name: 'brand icons',
  phase: 'tools',
  run: (ctx) => {
    const result = copyBrandIcons(ctx.rootDir, ctx.config);
    if (!result) return { status: 'skipped', detail: 'no icons.brand in brock.config.ts' };
    return { status: 'done', detail: `${result.written.length} written, ${result.current.length} already current` };
  },
});

export { brandIcons };
