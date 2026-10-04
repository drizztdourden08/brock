/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanWidgets } from './scan-widgets.mjs';
import { WIDGETS_OUTPUT } from './widget-conventions.constants.mjs';

/** @param {string} id */
const identifierOf = (id) => `${id.split('-').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('')}Widget`;

/** @param {string} name */
const metaName = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}Meta`;

/** @param {{ id: string, path: string, hasMeta: boolean }} file */
const importLine = (file) => {
  const name = identifierOf(file.id);
  const from = `../${file.path.replace(/\.tsx$/, '')}`;
  return file.hasMeta ? `import ${name}, { meta as ${metaName(name)} } from '${from}';` : `import ${name} from '${from}';`;
};

/** @param {{ id: string, hasMeta: boolean }} file */
const entryLine = (file) => {
  const name = identifierOf(file.id);
  return `  { ${[`id: '${file.id}'`, `component: ${name}`, ...(file.hasMeta ? [`meta: ${metaName(name)}`] : [])].join(', ')} },`;
};

/**
 * @param {{ id: string, path: string, hasMeta: boolean }[]} files
 * @param {{ path: string } | null} [layout] src/widgets/layout.ts, when the app has one
 * @returns {string} the content of .brock/widgets.ts
 */
const renderWidgets = (files, layout = null) => {
  const list = files.length ? ['[', ...files.map(entryLine), ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { widgetsFromFiles } from '${REACT_PACKAGE}';`,
    ...files.map(importLine),
    ...(layout ? [`import appWidgetLayout from '../${layout.path.replace(/\.ts$/, '')}';`] : []),
    '',
    `const appWidgets = widgetsFromFiles(${list});`,
    ...(layout ? [] : ['const appWidgetLayout = undefined;']),
    '',
    'export { appWidgetLayout, appWidgets };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/widgets.ts, always
 */
const renderWidgetsFiles = (rootDir) => {
  const { files, layout } = scanWidgets(rootDir);
  return [{ path: WIDGETS_OUTPUT, content: renderWidgets(files.filter((file) => file.hasDefault), layout?.hasDefault ? layout : null) }];
};

export { renderWidgets, renderWidgetsFiles };
