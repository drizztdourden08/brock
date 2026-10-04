/* @layer tooling-scripts @kind logic */

const SEEDED_STARTERS = [
  [
    ':root {',
    '--p-primary: #3b6fe0;',
    '--p-secondary: #9dbbff;',
    '--p-tertiary: #8e96a8;',
    '--p-on-primary: var(--p-pure-white);',
    '--p-on-secondary: var(--p-black);',
    '--p-on-tertiary: var(--p-black);',
    '}',
  ],
  [
    ':root {',
    '--p-primary: #f0862b;',
    '--p-secondary: #b9babc;',
    '--p-tertiary: #8a8b8d;',
    '--p-white: #f3f1ee;',
    '--p-black: #121314;',
    '--p-on-primary: var(--p-pure-black);',
    '--p-on-secondary: var(--p-pure-black);',
    '--p-on-tertiary: var(--p-pure-black);',
    '}',
  ],
];

const OVERRIDE_HEADER = '/* @layer renderer-app @kind style */\n';

const bodyLines = (source) => source.split(/\r?\n/).map((line) => line.trim()).filter((line) => line !== '' && !line.startsWith('/*'));

const isSeededStarter = (source) => {
  const lines = bodyLines(source);
  return SEEDED_STARTERS.some((stock) => lines.length === stock.length && lines.every((line, index) => line === stock[index]));
};

const apply = ({ source }) => {
  if (!isSeededStarter(source)) return { source, todos: [] };
  const header = source.match(/^\/\*[^\n]*\*\/\r?\n/)?.[0] ?? OVERRIDE_HEADER;
  return { source: header, todos: [] };
};

const migration = Object.freeze({
  id: 'brock-palette',
  summary: 'The starter theme no longer sets seeds: Brock imports Tessera\'s brand palettes and sets data-palette from product.icons.brand, so an untouched starter src/theme.css (the old blue seeds, or the Brock seeds) becomes an override-only file. A theme the app changed is kept.',
  files: /(^|\/)src\/theme\.css$/,
  apply,
});

export { migration };
