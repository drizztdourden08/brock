/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { CORE_I18N } from './i18n.constants.mjs';
import { isRenderer, layerList, layerParts } from './locale-layers.mjs';

/**
 * @param {import('./scan-locales.mjs').LocaleScan} scan
 * @returns {string} the content of .brock/locales.ts
 */
const renderLocales = ({ base, offered, sources }) => {
  const { imports, layers } = layerParts(sources.map((source) => ({ ...source, files: source.files.filter((file) => file.tag === base) })), isRenderer, 1);
  const loaders = offered.filter((tag) => tag !== base).map((tag) => `  '${tag}': () => import('./locales/${tag}'),`);
  return [
    GENERATED_HEADER,
    `import type { AppLocales } from '${REACT_PACKAGE}';`,
    `import type { Layer } from '${CORE_I18N}';`,
    ...imports,
    '',
    `const baseLayers: readonly Layer[] = ${layerList(layers)};`,
    '',
    `const chunks: Record<string, () => Promise<{ default: readonly Layer[] }>> = {${loaders.length ? `\n${loaders.join('\n')}\n` : ''}};`,
    '',
    'const appLocales: AppLocales = {',
    `  base: '${base}',`,
    `  tags: [${offered.map((tag) => `'${tag}'`).join(', ')}],`,
    '  layers: baseLayers,',
    '  load: async (tag) => (await chunks[tag]?.())?.default ?? [],',
    '};',
    '',
    'export { appLocales };',
    '',
  ].join('\n');
};

export { renderLocales };
