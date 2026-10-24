/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { followBrockPin } from '@drizztdourden08/brock-thread';

const PIN_FIELD = 'brock.version';
const RANGE_PREFIX = /^[\^~]/;

const rangeOf = (pkg, field) => {
  const [block, ...name] = field.split('.');
  return pkg[block]?.[name.join('.')];
};

const rangeNotices = (before, after, changed, check) =>
  changed
    .filter((field) => field !== PIN_FIELD)
    .map((field) => {
      const old = rangeOf(before, field);
      const target = String(old).replace(RANGE_PREFIX, '');
      return `brock sync: ${check ? 'would change' : 'changed'} ${field} from ${old} to ${rangeOf(after, field)} because ${PIN_FIELD} in package.json is ${after.brock.version}. To keep ${old}, move the pin with \`brock upgrade ${target}\`.`;
    });

/**
 * @param {string} rootDir the app folder
 * @param {string} version pinned when package.json has no brock.version
 * @param {boolean} check reports without writing
 * @returns {string[]} the package.json fields off the pin
 */
const pinApp = (rootDir, version, check) => {
  const file = join(rootDir, 'package.json');
  if (!existsSync(file)) return [];
  const before = JSON.parse(readFileSync(file, 'utf8'));
  const { pkg, changed } = followBrockPin(before, version);
  for (const notice of rangeNotices(before, pkg, changed, check)) console.warn(notice);
  if (changed.length > 0 && !check) writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  return changed;
};

export { pinApp };
