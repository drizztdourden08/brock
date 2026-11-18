/* @layer tooling-scripts @kind logic */
import { MAIN_NAMESPACE } from './i18n.constants.mjs';

const identifier = (text) => text.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const importPath = (source, file, depth) => `${source.kind === 'app' ? '../'.repeat(depth) : ''}${source.root}/${file.tag}/${file.namespace}.json`;

const rank = (source) => (source.kind === 'app' ? 1 : 0);

const byKind = (a, b) => rank(a) - rank(b);

/** @param {import('./scan-locale-dir.mjs').LocaleFile} file */
const isMain = (file) => MAIN_NAMESPACE.test(file.namespace);

/** @param {import('./scan-locale-dir.mjs').LocaleFile} file */
const isRenderer = (file) => !isMain(file);

/**
 * @param {import('./module-locale-sources.mjs').LocaleSource[]} sources
 * @param {(file: import('./scan-locale-dir.mjs').LocaleFile) => boolean} pick which files go in
 * @param {number} depth how many folders the output file sits below the app root
 * @returns {{ imports: string[], layers: string[] }} one import and one layer entry per picked file, modules before the app
 */
const layerParts = (sources, pick, depth) => {
  const rows = [...sources].sort(byKind).flatMap((source) => source.files.filter(pick).map((file) => ({
    name: `${identifier(source.id)}_${identifier(file.tag)}_${identifier(file.namespace)}`,
    path: importPath(source, file, depth),
    layer: `{ locale: '${file.tag}', namespace: '${file.namespace}', kind: '${source.kind}'`,
  })));
  return {
    imports: rows.map((row) => `import ${row.name} from '${row.path}';`),
    layers: rows.map((row) => `  ${row.layer}, messages: ${row.name} },`),
  };
};

/** @param {string[]} layers @returns {string} the array text */
const layerList = (layers) => (layers.length ? ['[', ...layers, ']'].join('\n') : '[]');

export { isMain, isRenderer, layerList, layerParts };
