/* @layer tooling-scripts @kind logic */
import { allPlatforms } from '../platforms/all-platforms.mjs';
import { expandTargets } from '../platforms/expand-targets.mjs';
import { BUNDLE_LABELS, BUNDLES } from '../platforms/platforms.constants.mjs';

const chosenBy = (id, targets) => {
  if (targets.includes(id)) return 'chosen';
  const bundle = targets.find((token) => BUNDLES[token]?.includes(id));
  return bundle ? `chosen (${bundle})` : '';
};

/**
 * @param {string[]} targets the targets as brock.config.ts writes them
 * @returns {string[]} one line per platform, then the bundles
 */
const platformListLines = (targets) => {
  const chosen = expandTargets(targets).platforms;
  const rows = allPlatforms().map((platform) => {
    const state = platform.supported ? chosenBy(platform.id, targets) : 'not supported yet';
    const mark = chosen.includes(platform.id) && platform.supported ? '*' : ' ';
    return `  ${mark} ${platform.id.padEnd(8)} ${platform.label.padEnd(8)} ${state}`.trimEnd();
  });
  const bundles = Object.entries(BUNDLES).map(([name, ids]) => `    ${name.padEnd(8)} ${ids.join(', ')}: ${BUNDLE_LABELS[name]}`);
  return [`targets in brock.config.ts: ${targets.join(', ') || '(none)'}`, '', ...rows, '', '  bundles:', ...bundles];
};

export { platformListLines };
