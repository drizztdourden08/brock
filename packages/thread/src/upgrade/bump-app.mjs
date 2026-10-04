/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { workspaceDirs } from '@drizztdourden08/standards/structure';
import { keepCrossDriveLinks } from '../links/keep-cross-drive-links.mjs';
import { jsonFile } from '../provision/json-file.mjs';
import { appDirs } from './app-dirs.mjs';
import { followBrockCatalog } from './follow-brock-catalog.mjs';
import { followBrockPin } from './follow-brock-pin.mjs';
import { followTessera } from './follow-tessera.mjs';
import { linkBrock } from './link-brock.mjs';
import { tesseraRange } from './tessera-range.mjs';
import { BROCK_PACKAGE, DEPENDENCY_BLOCKS, PIN_FIELD } from './upgrade.constants.mjs';

const ignoreInKnip = (dir, fields) => {
  const knip = jsonFile(join(dir, 'knip.json'));
  const config = knip.read();
  const names = fields.map((field) => field.slice(field.indexOf('.') + 1));
  if (!config || names.length === 0) return;
  const listed = Array.isArray(config.ignoreDependencies) ? config.ignoreDependencies : [];
  knip.write({ ...config, ignoreDependencies: [...new Set([...listed, ...names])] });
};

const packageOf = (dir) => jsonFile(join(dir, 'package.json')).read() ?? {};

const namesBrock = (pkg) =>
  (pkg.brock !== null && typeof pkg.brock === 'object')
  || DEPENDENCY_BLOCKS.some((block) => Object.keys(pkg[block] ?? {}).some((name) => BROCK_PACKAGE.test(name)));

const bumpedPackages = (rootDir, apps) => {
  const pinned = [...new Set([...(apps.includes(rootDir) || namesBrock(packageOf(rootDir)) ? [rootDir] : []), ...apps])];
  const others = workspaceDirs(rootDir).dirs.filter((dir) => !pinned.includes(dir) && namesBrock(packageOf(dir))).sort();
  return [...pinned.map((dir) => ({ dir, pin: true })), ...others.map((dir) => ({ dir, pin: false }))];
};

const followed = (pkg, plan) => {
  const pinned = { ...pkg, brock: { ...pkg.brock, version: plan.target } };
  return plan.relink && plan.checkout ? linkBrock(pinned, plan.checkout) : followBrockPin(pinned, plan.target);
};

const withBrockOf = (next, pkg) => {
  if (pkg.brock === undefined) return Object.fromEntries(Object.entries(next).filter(([key]) => key !== 'brock'));
  return { ...next, brock: pkg.brock };
};

const bumpPackage = ({ dir, pin }, plan, rootDir) => {
  const pkg = packageOf(dir);
  const result = followed(pkg, plan);
  const deps = result.changed.filter((field) => field !== PIN_FIELD);
  const changed = [...(pin && pkg.brock?.version !== plan.target ? [PIN_FIELD] : []), ...deps];
  if (changed.length > 0) jsonFile(join(dir, 'package.json')).write(pin ? result.pkg : withBrockOf(result.pkg, pkg));
  keepCrossDriveLinks(dir, rootDir);
  return { changed, deps };
};

const labelled = (rootDir, dir, fields) => {
  const label = relative(rootDir, dir).replace(/\\/g, '/');
  return label ? fields.map((field) => (field.startsWith('catalog.') ? field : `${label}: ${field}`)) : fields;
};

/**
 * @param {string} rootDir the upgrade worktree
 * @param {import('./upgrade.type.mjs').UpgradePlan} plan
 * @param {string[]} [apps] the app folders, absolute
 * @returns {string[]} the fields changed
 */
const bumpApp = (rootDir, plan, apps = appDirs(rootDir)) => {
  const range = tesseraRange(plan, rootDir);
  const bumped = bumpedPackages(rootDir, apps).map((entry) => {
    const { changed, deps } = bumpPackage(entry, plan, rootDir);
    return { deps, fields: labelled(rootDir, entry.dir, [...changed, ...followTessera(entry.dir, range, rootDir)]) };
  });
  if (plan.relink) ignoreInKnip(rootDir, bumped.flatMap(({ deps }) => deps));
  const catalog = plan.relink ? [] : followBrockCatalog(rootDir, plan.target);
  return [...bumped.flatMap(({ fields }) => fields), ...catalog];
};

export { bumpApp };
