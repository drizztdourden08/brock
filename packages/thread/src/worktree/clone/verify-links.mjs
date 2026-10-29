/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { isInside } from './path-map.mjs';

const realOrNull = (path) => {
  try {
    return realpathSync.native(path);
  } catch {
    return null;
  }
};

const holdsCheckout = (real) => {
  for (let dir = real; ; dir = dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return true;
    if (dirname(dir) === dir) return false;
  }
};

const allowed = (real, homes) => homes.some((home) => isInside(home, real)) || !holdsCheckout(real);

const walk = (dir, visit) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isSymbolicLink()) visit(path);
    else if (entry.isDirectory()) walk(path, visit);
  }
};

/**
 * @param {{ roots: string[], homes: string[] }} input the folders to walk, and the folders a link may lead into
 * @returns {{ path: string, real: string }[]} links that lead into some other checkout
 */
const strayLinks = ({ roots, homes }) => {
  const inside = homes.map((home) => realOrNull(home) ?? home);
  const found = [];
  const visit = (path) => {
    const real = realOrNull(path);
    if (real && !allowed(real, inside)) found.push({ path, real });
  };
  for (const root of roots) walk(root, visit);
  return found;
};

export { strayLinks };
