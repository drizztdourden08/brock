/* @layer tooling-scripts @kind logic */
const GLOB = 'src/screens/**/*.custom.tsx';
const MAIN_ENTRY = /^([ \t]*)"src\/main\.tsx",?[ \t]*$/gm;

const withGlob = (line, indent, eol) => {
  const trimmed = line.trimEnd();
  const last = !trimmed.endsWith(',');
  return `${last ? `${trimmed},` : trimmed}${eol}${indent}"${GLOB}"${last ? '' : ','}`;
};

const apply = ({ source }) => {
  if (source.includes(GLOB)) return { source, todos: [] };
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  return { source: source.replace(MAIN_ENTRY, (line, indent) => withGlob(line, indent, eol)), todos: [] };
};

const migration = Object.freeze({
  id: 'knip-custom-pages',
  summary: 'knip treats custom pages as entries, since the build reads their searchEntries export instead of importing it.',
  files: /^knip\.json$/,
  apply,
});

export { migration };
