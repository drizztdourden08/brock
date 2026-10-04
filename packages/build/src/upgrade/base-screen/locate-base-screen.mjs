/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findJsxProps } from '../codemods/find-jsx-props.mjs';
import { defineScreenCall } from './define-screen-call.mjs';
import { namedImport } from './named-import.mjs';
import { resolveModule } from './resolve-module.mjs';
import { screenParts } from './screen-parts.mjs';

const valueOf = (attribute) => attribute.replace(/^[^=]*=\s*/, '').replace(/^\{([\s\S]*)\}$/, '$1').trim();

const listFile = (rootDir, mainRel, main, expr) => {
  if (!/^[A-Za-z_$][\w$]*$/.test(expr)) return mainRel;
  const imported = namedImport(main, expr);
  return imported ? resolveModule(rootDir, mainRel, imported.from) : mainRel;
};

/**
 * @param {string} rootDir
 * @param {string} mainRel root-relative src/main.tsx
 * @param {string} main its source
 * @param {string} id the base screen id
 * @returns {{ file: string, source: string, call: { start: number, end: number }, parts: ReturnType<typeof screenParts> } | null}
 */
const locateBaseScreen = (rootDir, mainRel, main, id) => {
  const [prop] = findJsxProps(main, 'BrockApp', ['screens']);
  if (prop === undefined) return null;
  const file = listFile(rootDir, mainRel, main, valueOf(main.slice(prop.start, prop.end)));
  if (file === null) return null;
  const source = file === mainRel ? main : readFileSync(join(rootDir, file), 'utf8');
  const call = defineScreenCall(rootDir, file, source, id);
  const parts = call ? screenParts(call.body) : null;
  return call && parts ? { file, source, call, parts } : null;
};

export { locateBaseScreen };
