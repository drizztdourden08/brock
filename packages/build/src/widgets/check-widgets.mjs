/* @layer tooling-scripts @kind logic */
import { UNKNOWN } from '../screens/literal/literal.constants.mjs';
import { readExport } from '../screens/literal/read-export.mjs';
import { scanWidgets } from './scan-widgets.mjs';
import { MENU_FIELDS } from '../menu/menu-config.constants.mjs';
import { BUILT_IN_WIDGET_IDS, KIT_KEYS, MENU_PLACEMENT_KEYS, META_KEYS, OVERLAY_KEYS } from './widget-conventions.constants.mjs';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/** @param {import('./scan-widgets.mjs').WidgetFile} file @param {string} name @returns {Record<string, unknown> | null} */
const literalOf = (file, name) => {
  const value = readExport(file.source, name);
  return value !== UNKNOWN && isPlainObject(value) ? value : null;
};

/** @param {import('./scan-widgets.mjs').WidgetFile} file @param {Record<string, unknown> | null} meta @param {readonly string[]} keys @param {string} what @returns {string[]} */
const keyFindings = (file, meta, keys, what) =>
  Object.keys(meta ?? {}).filter((key) => !keys.includes(key)).map((key) => `${file.path}: ${what}.${key} is not a ${what === 'meta' ? 'widget' : 'kit'} field (${keys.join(', ')})`);

/** @param {import('./scan-widgets.mjs').WidgetFile} file @param {Record<string, unknown> | null} meta @param {ReadonlySet<string>} kits @returns {string[]} */
const kitNameFindings = (file, meta, kits) => {
  const kit = meta?.kit;
  return typeof kit === 'string' && !kits.has(kit) ? [`${file.path}: meta.kit names "${kit}", but there is no src/widgets/${kit}.kit.ts`] : [];
};

/** @param {string} key @param {unknown} value */
const placementValid = (key, value) => value === UNKNOWN || (key === 'parent' ? typeof value === 'string' && value !== '' : MENU_FIELDS[key]?.valid(value) === true);

/** @param {import('./scan-widgets.mjs').WidgetFile} file @param {Record<string, unknown> | null} meta @param {string} what @returns {string[]} */
const menuFindings = (file, meta, what) => {
  const menu = meta?.menu;
  if (menu === undefined || menu === UNKNOWN) return [];
  if (!isPlainObject(menu)) return [`${file.path}: ${what}.menu must be an object ({ ${MENU_PLACEMENT_KEYS.join(', ')} })`];
  return Object.entries(menu).flatMap(([key, value]) => {
    if (!MENU_PLACEMENT_KEYS.includes(key)) return [`${file.path}: ${what}.menu.${key} is not a menu placement field (${MENU_PLACEMENT_KEYS.join(', ')})`];
    return placementValid(key, value) ? [] : [`${file.path}: ${what}.menu.${key} must be ${key === 'parent' ? 'a submenu key' : MENU_FIELDS[key]?.wants}`];
  });
};

/** @param {ReadonlySet<string>} kits @returns {(file: import('./scan-widgets.mjs').WidgetFile) => string[]} */
const fileFindings = (kits) => (file) => {
  const meta = file.hasMeta ? literalOf(file, 'meta') : null;
  return [
    ...(file.hasDefault ? [] : [`${file.path}: no default export; a widget file default-exports its component`]),
    ...(BUILT_IN_WIDGET_IDS.includes(file.id) ? [`${file.path}: "${file.id}" is a built-in Brock widget id; pick another`] : []),
    ...keyFindings(file, meta, META_KEYS, 'meta'),
    ...menuFindings(file, meta, 'meta'),
    ...kitNameFindings(file, meta, kits),
  ];
};

/** @param {import('./scan-widgets.mjs').WidgetFile} file @returns {string[]} */
const ownKitFindings = (file) => {
  const kit = literalOf(file, 'default');
  return [...keyFindings(file, kit, KIT_KEYS, 'kit'), ...menuFindings(file, kit, 'kit')];
};

/** @param {import('./scan-widgets.mjs').WidgetFile} file @returns {string[]} */
const kitFindings = (file) => (file.hasDefault
  ? ownKitFindings(file)
  :[`${file.path}: no default export; a kit file default-exports its WidgetKitMeta ({ label, icon, devOnly, requires, layout })`]);

/** @param {ReadonlySet<string>} kits @returns {(file: import('./scan-widgets.mjs').WidgetFile) => string[]} */
const overlayFindings = (kits) => (file) => {
  const meta = file.hasMeta ? literalOf(file, 'meta') : null;
  return [
    ...(file.hasDefault ? [] : [`${file.path}: no default export; an overlay file default-exports its component`]),
    ...(file.hasMeta ? [] : [`${file.path}: no meta; an overlay exports meta = { kit } naming the kit it belongs to`]),
    ...keyFindings(file, meta, OVERLAY_KEYS, 'meta').map((finding) => finding.replace('a widget field', 'an overlay field')),
    ...kitNameFindings(file, meta, kits),
  ];
};

/**
 * @param {string} rootDir the app root
 * @returns {string[]} what brock structure reports about src/widgets
 */
const checkWidgets = (rootDir) => {
  const { files, kits, overlays, layout, findings } = scanWidgets(rootDir);
  const kitIds = new Set(kits.map((file) => file.id));
  const layoutFindings = layout && !layout.hasDefault ? [`${layout.path}: no default export; the layout file default-exports defineLayoutPreset({ rows })`] : [];
  return [...findings, ...layoutFindings, ...files.flatMap(fileFindings(kitIds)), ...kits.flatMap(kitFindings), ...overlays.flatMap(overlayFindings(kitIds))];
};

export { checkWidgets };
