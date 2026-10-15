/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { importSpecifiers } from '../src/testing/import-specifiers.mjs';
import { unresolvableImports } from '../src/testing/unresolvable-imports.mjs';
import { tempTree } from './temp-tree.mjs';

const tree = tempTree('brock-specifiers-');
afterEach(() => tree.cleanup());

const BUNDLE_WITH_TEXT = [
  '#!/usr/bin/env node',
  '"use strict";',
  'const path = require("node:path");',
  'const WORKFLOW = "steps:\\n  - run: node -e \\"require(\'./package.json\')\\"\\n";',
  'const single = \'import x from "./single.js"\';',
  'const template = `const pkg = require(\'./package.json\');\\nimport("./in-template.js");`;',
  'const nested = `a ${require("velopack")} b ${`inner ${1}`} require("./after.js")`;',
  '// require("./line-comment.js")',
  '/* import x from "./block-comment.js" */',
  'const pattern = /require\\("[^"]*"\\)|\'/g;',
  'const ratio = 4 / 2; const other = ratio / 1;',
  'const later = await import("./chunks/later.js", { with: { type: "js" } });',
  'export { thing } from "./thing.js";',
  'const notRequire = loader.require("./member.js");',
  'const glob = Array.from("abc");',
].join('\n');

describe('importSpecifiers in a bundle that holds code as text', () => {
  it('reads specifiers from the code only, never from strings, template text, comments or regular expressions', () => {
    expect(importSpecifiers(BUNDLE_WITH_TEXT)).toEqual(['node:path', 'velopack', './chunks/later.js', './thing.js']);
  });

  it('keeps reading code after a template, a regular expression and a division', () => {
    const source = 'const a = `x${y}z`; const b = /"/.test(a); const c = a.length / 2; const d = require("after");';
    expect(importSpecifiers(source)).toEqual(['after']);
  });

  it('lets a built main whose workflow text names ./package.json pass the launch check', () => {
    const dir = tree.tempDir();
    tree.put(dir, 'main.js', BUNDLE_WITH_TEXT.replace(/require\("velopack"\)/, 'require("node:fs")'));
    tree.put(dir, 'chunks/later.js', '');
    tree.put(dir, 'thing.js', '');
    expect(unresolvableImports(dir)).toEqual([]);
  });

  it('still reports a real import of a missing file', () => {
    const dir = tree.tempDir();
    tree.put(dir, 'main.js', 'const text = "require(\'./fine.js\')"; const pkg = require("./package.json");');
    expect(unresolvableImports(dir).map((entry) => entry.spec)).toEqual(['./package.json']);
  });
});
