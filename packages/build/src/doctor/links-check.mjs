/* @layer tooling-scripts @kind logic */
import { existsSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { declaredSpecs, readAppPackage } from './app-package.mjs';
import { linkSpecs } from './link-specs.mjs';

/** @param {string} path */
const isBrokenLink = (path) => {
  try {
    return lstatSync(path).isSymbolicLink() && !existsSync(path);
  } catch {
    return false;
  }
};

/** @param {import('./link-specs.mjs').LinkSpec} link */
const missingTarget = (link) =>
  `${link.name} is linked to ${link.target} (${link.spec} in ${link.source}), which does not exist. Fix: restore that folder or file, or edit the spec in ${link.source}, then pnpm install.`;

/** @type {{ label: string, run: (ctx: { rootDir: string }) => { problems: string[], detail: string } }} */
const linksCheck = {
  label: 'Links',
  run: ({ rootDir }) => {
    const links = linkSpecs(rootDir);
    const declared = declaredSpecs(readAppPackage(rootDir));
    const gone = links.filter((link) => !existsSync(link.target)).map(missingTarget);
    const dangling = [...new Set(links.map((link) => link.name))]
      .filter((name) => name in declared && isBrokenLink(join(rootDir, 'node_modules', ...name.split('/'))))
      .map((name) => `node_modules/${name} is a broken link. Fix: pnpm install.`);
    const detail = links.length ? `${links.length} linked dependenc${links.length === 1 ? 'y' : 'ies'}, every target exists` : 'no linked dependencies';
    return { problems: [...gone, ...dangling], detail };
  },
};

export { linksCheck };
