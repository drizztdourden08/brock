/* @layer tooling-scripts @kind logic */
import { existsSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { findLinks } from './find-links.mjs';

const detachLink = (root, rel, log) => {
  const full = join(root, rel);
  try {
    rmdirSync(full);
  } catch {
    unlinkSync(full);
  }
  log(`Detached link: ${rel}`);
};

const detachAllLinks = (root, log) => {
  const links = findLinks(root);
  for (const rel of links) {
    detachLink(root, rel, log);
    if (existsSync(join(root, rel))) {
      throw new Error(`Failed to detach link "${rel}" under ${root}. Refusing to continue.`);
    }
  }
  return links;
};

export { detachAllLinks };
