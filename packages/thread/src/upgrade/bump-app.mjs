/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { keepCrossDriveLinks } from '../links/keep-cross-drive-links.mjs';
import { jsonFile } from '../provision/json-file.mjs';
import { followBrockPin } from './follow-brock-pin.mjs';
import { linkBrock } from './link-brock.mjs';
import { PIN_FIELD } from './upgrade.constants.mjs';

const ignoreInKnip = (dir, fields) => {
  const knip = jsonFile(join(dir, 'knip.json'));
  const config = knip.read();
  const names = fields.map((field) => field.slice(field.indexOf('.') + 1));
  if (!config || names.length === 0) return;
  const listed = Array.isArray(config.ignoreDependencies) ? config.ignoreDependencies : [];
  knip.write({ ...config, ignoreDependencies: [...new Set([...listed, ...names])] });
};

/**
 * @param {string} dir the upgrade worktree
 * @param {import('./upgrade.type.mjs').UpgradePlan} plan
 * @returns {string[]} the package.json fields changed
 */
const bumpApp = (dir, plan) => {
  const file = jsonFile(join(dir, 'package.json'));
  const pkg = file.read() ?? {};
  const pinned = { ...pkg, brock: { ...pkg.brock, version: plan.target } };
  const followed = plan.relink && plan.checkout ? linkBrock(pinned, plan.checkout) : followBrockPin(pinned, plan.target);
  const deps = followed.changed.filter((field) => field !== PIN_FIELD);
  const changed = [...(pkg.brock?.version === plan.target ? [] : [PIN_FIELD]), ...deps];
  if (changed.length > 0) file.write(followed.pkg);
  if (plan.relink) ignoreInKnip(dir, deps);
  keepCrossDriveLinks(dir);
  return changed;
};

export { bumpApp };
