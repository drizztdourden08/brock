/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { KEY_USE } from './cli.constants.mjs';
import { sourceFiles } from './source-files.mjs';

const globPattern = (glob) => new RegExp(`^${glob.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`);

const usedKeys = (rootDir) => new Set(sourceFiles(rootDir).flatMap((file) => [...readFileSync(file, 'utf8').matchAll(KEY_USE)].map((match) => match[1])));

/**
 * @param {{ rootDir: string, baseFiles: Map<string, import('../scan-locale-dir.mjs').LocaleFile>, dynamicKeys: string[] }} input the app
 * @returns {string[]} the base keys no literal 'ns:key' in src uses and no dynamicKeys glob covers
 */
const unusedKeys = ({ rootDir, baseFiles, dynamicKeys }) => {
  const used = usedKeys(rootDir);
  const dynamic = dynamicKeys.map(globPattern);
  return [...baseFiles.values()]
    .flatMap((file) => Object.keys(file.messages).map((key) => `${file.namespace}:${key}`))
    .filter((full) => !used.has(full) && !dynamic.some((pattern) => pattern.test(full)));
};

export { unusedKeys };
