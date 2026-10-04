/* @layer tooling-scripts @kind logic */
import { SCREENS_DIR } from './screen-conventions.constants.mjs';

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @param {string[]} buckets
 * @returns {string[]}
 */
const baseFindings = (files, buckets) => {
  const bases = files.filter((file) => file.kind === 'base');
  const screens = files.filter((file) => file.kind === 'card' || file.kind === 'layer').map((file) => file.id);
  return [
    ...(bases.length > 1 ? [`${SCREENS_DIR}: ${bases.length} base screens (${bases.map((file) => file.path.split('/').at(-1)).join(', ')}); an app has one .base.tsx`] : []),
    ...bases.filter((base) => buckets.includes(base.id) || screens.includes(base.id))
      .map((base) => `${base.path}: "${base.id}" is also a bucket or a screen; give the base screen an id of its own`),
  ];
};

export { baseFindings };
