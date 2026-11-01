/* @layer tooling-scripts @kind test */
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { brockKnipPreprocessors } from '../brock-knip-preprocessors.mjs';
import { put } from './lint-fixture.mjs';

const roots = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

const consumer = () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'brock-knip-pre-')));
  roots.push(root);
  put(root, 'package.json', '{ "name": "consumer" }');
  return root;
};

const withBuild = (root, files) => {
  const base = 'node_modules/@drizztdourden08/brock-build';
  put(root, `${base}/package.json`, '{ "name": "@drizztdourden08/brock-build", "version": "1.0.0" }');
  for (const file of files) put(root, `${base}/${file}`, '');
};

describe('K1 the knip preprocessor of the Brock extension', { tags: ['critical'] }, () => {
  it('is the absolute path of the file in brock-build, resolved from the consumer root', () => {
    const root = consumer();
    withBuild(root, ['src/knip-brock-dependencies.mjs']);
    const [file] = brockKnipPreprocessors(root);
    expect(isAbsolute(file)).toBe(true);
    expect(file.replace(/\\/g, '/')).toBe(join(root, 'node_modules/@drizztdourden08/brock-build/src/knip-brock-dependencies.mjs').replace(/\\/g, '/'));
  });

  it('adds nothing when brock-build does not resolve', () => {
    expect(brockKnipPreprocessors(consumer())).toEqual([]);
  });

  it('adds nothing when brock-build has no such file', () => {
    const root = consumer();
    withBuild(root, []);
    expect(brockKnipPreprocessors(root)).toEqual([]);
  });
});
