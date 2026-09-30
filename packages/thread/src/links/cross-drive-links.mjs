/* @layer tooling-scripts @kind logic */
import { DRIVE_PATH, LINK_BLOCKS, LINK_PREFIX } from './links.constants.mjs';

const driveOf = (path) => DRIVE_PATH.exec(path)?.[1].toLowerCase() ?? null;

const onAnotherDrive = (spec, home) => {
  if (typeof spec !== 'string' || !spec.startsWith(LINK_PREFIX)) return false;
  const drive = driveOf(spec.slice(LINK_PREFIX.length));
  return drive !== null && drive !== home;
};

/**
 * @param {Record<string, any>} pkg a package.json
 * @param {string} rootDir the folder that holds it
 * @returns {string[]} the packages linked from another Windows drive
 */
const crossDriveLinks = (pkg, rootDir) => {
  const home = driveOf(rootDir);
  if (home === null) return [];
  const specs = LINK_BLOCKS.flatMap((block) => Object.entries(pkg?.[block] ?? {}));
  return [...new Set(specs.filter(([, spec]) => onAnotherDrive(spec, home)).map(([name]) => name))];
};

export { crossDriveLinks };
