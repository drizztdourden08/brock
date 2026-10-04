/* @layer tooling-scripts @kind logic */
const SIZES = ['32', '24'];
const LOGO = /^(\*\*\/)?public\/logos\/icon-256\.png$/;

const apply = ({ source }) => {
  const lines = source.split(/\r?\n/);
  const anchor = lines.findIndex((line) => LOGO.test(line.trim()));
  if (anchor === -1) return { source, todos: [] };
  const prefix = lines[anchor].trim().startsWith('**/') ? '**/' : '';
  const present = new Set(lines.map((line) => line.trim()));
  const missing = SIZES.map((size) => `${prefix}public/logos/icon-${size}.png`).filter((entry) => !present.has(entry));
  if (missing.length === 0) return { source, todos: [] };
  lines.splice(anchor + 1, 0, ...missing);
  return { source: lines.join(source.includes('\r\n') ? '\r\n' : '\n'), todos: [] };
};

const migration = Object.freeze({
  id: 'gitignore-title-bar-logos',
  summary: 'brock icons now also writes public/logos/icon-32.png, the title bar logo, and icon-24.png; git ignores them beside icon-256.png.',
  files: /^\.gitignore$/,
  apply,
});

export { migration };
