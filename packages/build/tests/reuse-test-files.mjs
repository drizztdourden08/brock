/* @layer tooling-scripts @kind test */
import { readdirSync, statSync, utimesSync } from 'node:fs';
import { join } from 'node:path';

const HOUR = 3_600_000;

const SETTLED = new Date(Date.now() - 2 * HOUR);

const settleDirs = (dir) => {
  utimesSync(dir, SETTLED, SETTLED);
  for (const entry of readdirSync(dir)) if (statSync(join(dir, entry)).isDirectory()) settleDirs(join(dir, entry));
};

const age = (root, path, ms = 2 * HOUR) => {
  const when = new Date(Date.now() - ms);
  utimesSync(join(root, path), when, when);
  settleDirs(root);
};

export { age, HOUR };
