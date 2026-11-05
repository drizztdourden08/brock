/* @layer core @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const VALUE_IMPORT = /^(?:import|export)\s(?!type\s)[^;]*?from\s+'(\.[^']*)'/gm;
const SUFFIXES = ['.ts', '.tsx', '/index.ts'];

const resolveImport = (from: string, spec: string): string | undefined => {
  const base = resolve(dirname(from), spec);
  return SUFFIXES.map((suffix) => base + suffix).find((candidate) => existsSync(candidate));
};

const importsOf = (file: string): string[] =>
  [...readFileSync(file, 'utf8').matchAll(VALUE_IMPORT)]
    .map((match) => resolveImport(file, match[1] ?? ''))
    .filter((target): target is string => target !== undefined);

const reached = (entry: string): string[] => {
  const seen = new Set<string>([entry]);
  const queue = [entry];
  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    for (const next of importsOf(file)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return [...seen];
};

const offends = (file: string): boolean => {
  const source = readFileSync(file, 'utf8');
  return source.includes('@drizztdourden08/brock-react') || source.includes('@layer renderer-shell');
};

describe('session barrel', () => {
  it('stays main-process safe', () => {
    const entry = resolve(__dirname, '../src/session/index.ts');
    expect(reached(entry).filter(offends)).toEqual([]);
  });
});
