/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../screens/screen-conventions.constants.mjs';
import { CORE_I18N } from './i18n.constants.mjs';
import { isRenderer, layerList, layerParts } from './locale-layers.mjs';

/**
 * @param {import('./module-locale-sources.mjs').LocaleSource[]} sources
 * @param {string} tag the language of the chunk
 * @returns {string} the content of .brock/locales/<tag>.ts
 */
const renderLocaleChunk = (sources, tag) => {
  const { imports, layers } = layerParts(sources.map((source) => ({ ...source, files: source.files.filter((file) => file.tag === tag) })), isRenderer, 2);
  return [
    GENERATED_HEADER,
    `import type { Layer } from '${CORE_I18N}';`,
    ...imports,
    '',
    `const layers: readonly Layer[] = ${layerList(layers)};`,
    '',
    'export default layers;',
    '',
  ].join('\n');
};

export { renderLocaleChunk };
