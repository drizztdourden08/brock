/* @layer tooling-scripts @kind logic */
import { UNKNOWN } from '../screens/literal/literal.constants.mjs';
import { readExport } from '../screens/literal/read-export.mjs';
import { scanWidgets } from './scan-widgets.mjs';
import { BUILT_IN_WIDGET_IDS, META_KEYS } from './widget-conventions.constants.mjs';

/** @param {unknown} value */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/** @param {import('./scan-widgets.mjs').WidgetFile} file @returns {string[]} */
const metaFindings = (file) => {
  if (!file.hasMeta) return [];
  const meta = readExport(file.source, 'meta');
  if (meta === UNKNOWN || !isPlainObject(meta)) return [];
  return Object.keys(meta).filter((key) => !META_KEYS.includes(key)).map((key) => `${file.path}: meta.${key} is not a widget field (${META_KEYS.join(', ')})`);
};

/** @param {import('./scan-widgets.mjs').WidgetFile} file @returns {string[]} */
const fileFindings = (file) => [
  ...(file.hasDefault ? [] : [`${file.path}: no default export; a widget file default-exports its component`]),
  ...(BUILT_IN_WIDGET_IDS.includes(file.id) ? [`${file.path}: "${file.id}" is a built-in Brock widget id; pick another`] : []),
  ...metaFindings(file),
];

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/widgets
 */
const checkWidgets = (rootDir) => {
  const { files, layout, findings } = scanWidgets(rootDir);
  const layoutFindings = layout && !layout.hasDefault ? [`${layout.path}: no default export; the layout file default-exports defineLayoutPreset({ rows })`] : [];
  return [...findings, ...layoutFindings, ...files.flatMap(fileFindings)];
};

export { checkWidgets };
