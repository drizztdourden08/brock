/* @layer tooling-scripts @kind logic */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { derivePortBase } from '@drizztdourden08/brock-build';

const PORTS_ENTRY = /ports:\s*\{\s*base:\s*\d+/;
const APP_ID_LINE = /^(\s*)appId:.*$/m;

/**
 * @param {string} targetDir
 * @param {string} id the product id
 * @returns {number} the base written into brock.config.ts
 */
const writePortBase = (targetDir, id) => {
  const file = join(targetDir, 'brock.config.ts');
  const base = derivePortBase(id);
  const source = readFileSync(file, 'utf8');
  const next = PORTS_ENTRY.test(source)
    ? source.replace(PORTS_ENTRY, `ports: { base: ${base}`)
    : source.replace(APP_ID_LINE, (line, indent) => `${line}\n${indent}ports: { base: ${base} },`);
  writeFileSync(file, next, 'utf8');
  return base;
};

export { writePortBase };
