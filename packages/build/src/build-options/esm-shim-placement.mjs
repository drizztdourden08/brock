/* @layer tooling-scripts @kind logic */
import { CJS_SHIM_BLOCK, CJS_SHIM_MODULE } from './build-options.constants.mjs';

/**
 * @param {{ body: { type: string, end: number, specifiers?: { local: { name: string } }[] }[] }} program
 * @returns {boolean} the shim is code, not text inside a string
 */
const shimIsStatement = (program) => program.body.some((node) => node.type === 'ImportDeclaration' && node.specifiers.some((spec) => spec.local.name === CJS_SHIM_MODULE));

/**
 * @param {{ body: { type: string, end: number }[] }} program
 * @returns {number} where the last import statement ends, 0 without one
 */
const lastImportEnd = (program) => program.body.filter((node) => node.type === 'ImportDeclaration').at(-1)?.end ?? 0;

/**
 * @param {string} code a built chunk
 * @param {(code: string) => any} parse the bundler's parser
 * @returns {string | null} the chunk with the shim moved, or null
 */
const placeShim = (code, parse) => {
  const found = CJS_SHIM_BLOCK.exec(code);
  if (!found) return null;
  try {
    if (shimIsStatement(parse(code))) return null;
    const without = `${code.slice(0, found.index)}${code.slice(found.index + found[0].length)}`;
    const at = lastImportEnd(parse(without));
    return `${without.slice(0, at)}${found[0]}${without.slice(at)}`;
  } catch {
    return null;
  }
};

/**
 * @returns {import('vite').Plugin} keeps the CommonJS shim out of strings
 */
const esmShimPlacement = () => ({
  name: 'brock-esm-shim-placement',
  apply: 'build',
  enforce: 'post',
  renderChunk(code, _chunk, { format }) {
    if (format !== 'es') return null;
    const placed = placeShim(code, (text) => this.parse(text));
    return placed === null ? null : { code: placed, map: null };
  },
});

export { esmShimPlacement, placeShim };
