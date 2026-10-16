/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, LAZY_COMPONENT, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';

/** @param {string} id */
const camelOf = (id) => id.split('-').map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('');

/** @param {{ path: string }} file */
const sourceOf = (file) => `../${file.path.replace(/\.tsx?$/, '')}`;

/** @param {{ id: string }} file */
const kitName = (file) => `${camelOf(file.id)}Kit`;

/** @param {{ id: string }} file */
const overlayMetaName = (file) => `${camelOf(file.id)}OverlayMeta`;

/** @param {{ id: string, path: string }} file */
const overlayLine = (file) =>
  `    { id: '${file.id}', component: ${LAZY_COMPONENT}(() => import('${sourceOf(file)}')), meta: ${overlayMetaName(file)} },`;

/** @param {string} key @param {string[]} lines */
const listBlock = (key, lines) => (lines.length ? [`  ${key}: [`, ...lines, '  ],'] : [`  ${key}: [],`]);

/**
 * @param {{ id: string, path: string }[]} kits the kit files with a default export
 * @param {{ id: string, path: string }[]} [overlays] the overlay files with a meta
 * @returns {string} the content of .brock/widget-kits.ts
 */
const renderWidgetKits = (kits, overlays = []) => [
  GENERATED_HEADER,
  `import { ${[...(overlays.length ? [LAZY_COMPONENT] : []), 'widgetKitsFromFiles'].join(', ')} } from '${REACT_PACKAGE}';`,
  ...kits.map((file) => `import ${kitName(file)} from '${sourceOf(file)}';`),
  ...overlays.map((file) => `import { meta as ${overlayMetaName(file)} } from '${sourceOf(file)}';`),
  '',
  'const appWidgetKits = widgetKitsFromFiles({',
  ...listBlock('kits', kits.map((file) => `    { id: '${file.id}', meta: ${kitName(file)} },`)),
  ...listBlock('overlays', overlays.map(overlayLine)),
  '});',
  '',
  'export { appWidgetKits };',
  '',
].join('\n');

export { renderWidgetKits };
