/* @layer tooling-scripts @kind logic */
import { rebuildGlyf } from './rebuild-glyf.mjs';
import { woff2Tables } from './woff2-tables.mjs';
import { writeSfnt } from './write-sfnt.mjs';

/**
 * @param {Buffer} woff2
 * @returns {Buffer}  the same font as a TrueType file, which resvg can load
 */
const woff2ToTtf = (woff2) => {
  const { flavor, tables } = woff2Tables(woff2);
  const other = tables.find(({ tag, transformed }) => transformed && tag !== 'glyf' && tag !== 'loca');
  if (other) throw new Error(`the WOFF2 ${other.tag} transform is not read`);
  const glyf = tables.find(({ tag, transformed }) => tag === 'glyf' && transformed);
  const rebuilt = glyf ? rebuildGlyf(glyf.data) : null;
  const sfnt = tables.map(({ tag, data }) => ({ tag, data: rebuilt && (tag === 'glyf' || tag === 'loca') ? rebuilt[tag] : data }));
  return writeSfnt(flavor, sfnt);
};

export { woff2ToTtf };
