/* @layer tooling-scripts @kind logic */
import { isAbsolute, relative, resolve, sep } from 'node:path';

const SECTION_LINE = /^(\S[^:]*):/;
const IMPORTER_LINE = /^ {2}(?:'([^']+)'|"([^"]+)"|([^\s'"][^:]*)):\s*$/;
const LINK = /\blink:([^\s'",}]+)/g;

const inside = (root, path) => {
  const rel = relative(root, path);
  return !rel.startsWith('..') && !isAbsolute(rel);
};

const absoluteLink = (installRoot, importer) => (whole, target) => {
  if (!target.startsWith('.')) return whole;
  const path = resolve(installRoot, importer, target);
  return inside(installRoot, path) ? whole : `link:${path.split(sep).join('/')}`;
};

const importerOf = (line, section, importer) => {
  const key = section === 'importers' ? IMPORTER_LINE.exec(line) : null;
  return key ? key[1] ?? key[2] ?? key[3] : importer;
};

/**
 * @param {string} content a pnpm lockfile
 * @param {string} installRoot the folder its importer paths start from
 * @returns {string} the text with outward links made absolute
 */
const portableLockfile = (content, installRoot) => {
  let section = '';
  let importer = '.';
  return content.split('\n').map((line) => {
    const top = SECTION_LINE.exec(line);
    if (top) {
      section = top[1];
      importer = '.';
      return line;
    }
    importer = importerOf(line, section, importer);
    return line.replace(LINK, absoluteLink(installRoot, importer));
  }).join('\n');
};

export { portableLockfile };
