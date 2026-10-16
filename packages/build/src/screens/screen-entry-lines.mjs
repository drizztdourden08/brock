/* @layer tooling-scripts @kind logic */
import { EAGER_KINDS, LAZY_COMPONENT } from './screen-conventions.constants.mjs';

/** @param {string} word */
const capital = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const identifierOf = (file) =>
  [file.bucket, file.group, file.page, file.id, file.kind].filter(Boolean).flatMap((part) => String(part).split('-')).map(capital).join('');

/** @param {string} name */
const metaName = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}Meta`;

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const sourceOf = (file) => `../${file.path.replace(/\.tsx?$/, '')}`;

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const isLazy = (file) => !EAGER_KINDS.includes(file.kind);

/** @param {import('./scan-screens.mjs').ScreenFile} file @returns {string[]} */
const importLines = (file) => {
  const name = identifierOf(file);
  const from = sourceOf(file);
  if (isLazy(file) || file.kind === 'page-meta') return file.hasMeta ? [`import { meta as ${metaName(name)} } from '${from}';`] : [];
  return [file.hasMeta ? `import ${name}, { meta as ${metaName(name)} } from '${from}';` : `import ${name} from '${from}';`];
};

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const entryLine = (file) => {
  const name = identifierOf(file);
  const place = [['bucket', file.bucket], ['group', file.group], ['page', file.page], ['id', file.id]]
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`);
  const body = { settings: [`sections: ${name}`], 'page-meta': [] }[file.kind] ?? [`component: ${LAZY_COMPONENT}(() => import('${sourceOf(file)}'))`];
  const meta = file.hasMeta ? [`meta: ${metaName(name)}`] : [];
  return `  { ${[`kind: '${file.kind}'`, ...place, ...body, ...meta].join(', ')} },`;
};

export { entryLine, importLines, isLazy };
