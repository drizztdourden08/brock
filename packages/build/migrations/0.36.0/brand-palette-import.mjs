/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRIES = ['src/main.tsx', 'src/main.ts'];
const PALETTE_IMPORT = "import '../.brock/palette.css';";
const HAS_PALETTE = /['"](?:\.\.\/)+\.brock\/palette\.css['"]/;
const TOKENS_IMPORT = /^import\s+['"]@drizztdourden08\/tessera\/tokens\.css['"];?[^\S\r\n]*$/m;
const HEADER = /^\/\*\s*@layer[^\n]*\*\/[^\S\r\n]*$/m;

const insertAfter = (source, match, eol) => {
  const at = match.index + match[0].length;
  return `${source.slice(0, at)}${eol}${PALETTE_IMPORT}${source.slice(at)}`;
};

const withPalette = (source) => {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const anchor = TOKENS_IMPORT.exec(source) ?? HEADER.exec(source);
  return anchor ? insertAfter(source, anchor, eol) : `${PALETTE_IMPORT}${eol}${source}`;
};

const NO_ENTRY = {
  file: 'src/main.tsx',
  line: null,
  message: "The app has no src/main.tsx. Import '.brock/palette.css' in the renderer entry, after @drizztdourden08/tessera/tokens.css, so the app keeps its brand palette.",
};

const workspace = ({ rootDir }) => {
  const entry = ENTRIES.find((file) => existsSync(join(rootDir, file)));
  if (!entry) return { touched: [], todos: existsSync(join(rootDir, 'src')) ? [NO_ENTRY] : [] };
  const file = join(rootDir, entry);
  const source = readFileSync(file, 'utf8');
  if (HAS_PALETTE.test(source)) return { touched: [] };
  writeFileSync(file, withPalette(source), 'utf8');
  return { touched: [entry] };
};

const migration = Object.freeze({
  id: 'brand-palette-import',
  summary: "The shell no longer bundles every Tessera brand palette into every app. brock sync writes .brock/palette.css with the palette of product.icons.brand alone, and the renderer entry imports it after Tessera's tokens.css.",
  workspace,
});

export { migration };
