/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER } from '../screens/screen-conventions.constants.mjs';
import { CORE_I18N, ELECTRON_MAIN } from './i18n.constants.mjs';
import { isMain, layerList, layerParts } from './locale-layers.mjs';

const ofTag = (sources, tag) => layerParts(sources.map((source) => ({ ...source, files: source.files.filter((file) => file.tag === tag) })), isMain, 1);

/**
 * @param {import('./scan-locales.mjs').LocaleScan} scan
 * @returns {string} the content of .brock/locales.main.ts
 */
const renderLocalesMain = ({ base, offered, sources }) => {
  const baseParts = ofTag(sources, base);
  const others = offered.filter((tag) => tag !== base).map((tag) => ({ tag, ...ofTag(sources, tag) }));
  const loaders = others.map(({ tag, layers }) => `  '${tag}': async () => ${layerList(layers)},`);
  return [
    GENERATED_HEADER,
    `import type { MainLocales } from '${ELECTRON_MAIN}';`,
    `import type { Layer } from '${CORE_I18N}';`,
    ...baseParts.imports,
    ...others.flatMap(({ imports }) => imports),
    '',
    `const baseLayers: readonly Layer[] = ${layerList(baseParts.layers)};`,
    '',
    'const mainLocales: MainLocales = {',
    `  base: '${base}',`,
    '  layers: baseLayers,',
    `  loaders: {${loaders.length ? `\n${loaders.join('\n')}\n  ` : ''}},`,
    '};',
    '',
    'export { mainLocales };',
    '',
  ].join('\n');
};

export { renderLocalesMain };
