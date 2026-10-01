/* @layer tooling-scripts @kind logic */
import { findJsxProps } from '../../src/upgrade/index.mjs';

const RENAMES = Object.freeze({ variant: 'tone', secondaryVariant: 'secondaryTone' });
const TESSERA = /['"]@drizztdourden08\/tessera(?:\/[\w-]+)?['"]/;
const OLD_TYPE = /\bProgressVariant\b/g;

const renameProp = (source, { name, start }) => source.slice(0, start) + RENAMES[name] + source.slice(start + name.length);

const apply = ({ source }) => {
  if (!TESSERA.test(source)) return { source, todos: [] };
  const props = findJsxProps(source, 'ProgressBar', Object.keys(RENAMES)).sort((a, b) => b.start - a.start);
  return { source: props.reduce(renameProp, source).replace(OLD_TYPE, 'ProgressTone'), todos: [] };
};

const migration = Object.freeze({
  id: 'progress-bar-tone',
  summary: 'Tessera ProgressBar takes tone and secondaryTone in place of variant and secondaryVariant, and ProgressVariant is ProgressTone; each is renamed.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
