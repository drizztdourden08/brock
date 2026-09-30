/* @layer tooling-scripts @kind logic */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { scanScreens } from './scan-screens.mjs';
import { GENERATED_HEADER, REACT_PACKAGE, SCREENS_CONFIG, SCREENS_DIR, SCREENS_OUTPUT } from './screen-conventions.constants.mjs';

/** @param {string} word */
const capital = (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const identifierOf = (file) =>
  [file.bucket, file.group, file.page, file.id, file.kind].filter(Boolean).flatMap((part) => String(part).split('-')).map(capital).join('');

/** @param {string} name */
const metaName = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}Meta`;

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const importLine = (file) => {
  const name = identifierOf(file);
  const from = `../${file.path.replace(/\.tsx?$/, '')}`;
  return file.hasMeta ? `import ${name}, { meta as ${metaName(name)} } from '${from}';` : `import ${name} from '${from}';`;
};

/** @param {import('./scan-screens.mjs').ScreenFile} file */
const entryLine = (file) => {
  const name = identifierOf(file);
  const place = [['bucket', file.bucket], ['group', file.group], ['page', file.page], ['id', file.id]]
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`);
  const body = file.kind === 'settings' ? `sections: ${name}` : `component: ${name}`;
  const meta = file.hasMeta ? [`meta: ${metaName(name)}`] : [];
  return `  { ${[`kind: '${file.kind}'`, ...place, body, ...meta].join(', ')} },`;
};

/**
 * @param {import('./scan-screens.mjs').ScreenFile[]} files
 * @returns {string}
 */
const renderScreens = (files) => {
  const list = files.length ? ['[', ...files.map(entryLine), ']'].join('\n') : '[]';
  return [
    GENERATED_HEADER,
    `import { buildScreenTree } from '${REACT_PACKAGE}';`,
    `import config from '../${SCREENS_DIR}/${SCREENS_CONFIG.replace(/\.ts$/, '')}';`,
    ...files.map(importLine),
    '',
    `const screenTree = buildScreenTree(config, ${list});`,
    '',
    'export { screenTree };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir
 * @returns {{ path: string, content: string }[]} none when the app has no screens.config.ts
 */
const renderScreensFiles = (rootDir) =>
  existsSync(join(rootDir, SCREENS_DIR, SCREENS_CONFIG)) ? [{ path: SCREENS_OUTPUT, content: renderScreens(scanScreens(rootDir).files) }] : [];

export { renderScreens, renderScreensFiles };
