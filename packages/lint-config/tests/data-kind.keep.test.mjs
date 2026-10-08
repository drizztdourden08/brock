/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { ESLint } from 'eslint';
import { afterEach, describe, expect, it } from 'vitest';
import { dataBlocks } from '../data-blocks.mjs';
import { dataFiles } from '../data-files.mjs';
import { brockEslint } from '../eslint.mjs';

const roots = new Set();

const tempDir = () => roots.add(mkdtempSync(join(tmpdir(), 'brock-data-kind-'))) && [...roots].at(-1);

const put = (root, path, content) => {
  const file = join(root, ...path.split('/'));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
};

afterEach(() => {
  roots.forEach((root) => rmSync(root, { recursive: true, force: true }));
  roots.clear();
});

const LINT_TIMEOUT_MS = 60000;

const header = (kind) => `/* @layer shared-game @kind ${kind} */\n`;

const records = (count) => [
  "import type { TagRecord } from './tag-record.type';",
  "import { BASE_TAGS } from './base-tags.constants';",
  '',
  'const ALL_TAGS: TagRecord[] = [',
  '  ...BASE_TAGS,',
  ...Array.from({ length: count }, (_, i) => `  { id: 'tag-${i}', name: \`env:\${'x'}\`, bit: 1 << ${i % 8}, weight: -${i}, [BASE_TAGS.length]: true },`),
  '];',
  '',
  "const ORDER = Object.freeze(['env', 'area'] as const);",
  '',
  'export { ALL_TAGS, ORDER };',
  '',
].join('\n');

const lintRules = async (root, file) => {
  const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: brockEslint({ rootDir: root, typed: false }) });
  const [result] = await eslint.lintFiles([join(root, file)]);
  return result.messages.map((message) => message.ruleId);
};

const app = () => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'data-kind-fixture', private: true, type: 'module' }));
  put(root, 'records/tag-record.type.ts', `${header('types')}interface TagRecord { id: string }\n\nexport type { TagRecord };\n`);
  put(root, 'records/base-tags.constants.ts', `${header('constants')}const BASE_TAGS = [] as const;\n\nexport { BASE_TAGS };\n`);
  return root;
};

describe('the data file kind', () => {
  it('finds the files whose header says @kind data, and nothing in dot-folders or node_modules', () => {
    const root = app();
    put(root, 'records/tags.ts', `${header('data')}${records(2)}`);
    put(root, 'records/logic.ts', `${header('logic')}const x = 1;\nexport { x };\n`);
    put(root, '.cache/old.ts', `${header('data')}const x = 1;\n`);
    put(root, 'node_modules/pkg/index.ts', `${header('data')}const x = 1;\n`);
    expect(dataFiles(root)).toEqual(['records/tags.ts']);
    expect(dataBlocks(root)).toEqual([{ name: 'brock/data-files', basePath: root, files: ['records/tags.ts'], rules: { 'max-lines': 'off', 'local/one-export-per-file': 'off', 'local/constants-in-constants-file': 'off' } }]);
    expect(dataBlocks(tempDir())).toEqual([]);
  });

  it('lets a data file run past 200 lines, export two lists and hold UPPER_SNAKE consts', async () => {
    const root = app();
    put(root, 'records/tags.ts', `${header('data')}${records(240)}`);
    expect(await lintRules(root, 'records/tags.ts')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('keeps the rules on the same file when its header names another kind', async () => {
    const root = app();
    put(root, 'records/tags.ts', `${header('logic')}${records(240)}`);
    expect(await lintRules(root, 'records/tags.ts')).toEqual(expect.arrayContaining(['max-lines', 'local/one-export-per-file', 'local/constants-in-constants-file']));
  }, LINT_TIMEOUT_MS);

  it('refuses logic in a data file, so the kind exempts no code', async () => {
    const root = app();
    const logic = [
      'const ALL_TAGS = [{ id: \'a\', pick: () => 1 }];',
      'const COUNT = ALL_TAGS.length > 0 ? 1 : 0;',
      'let cursor = 0;',
      'const BUILT = makeTags();',
      'const MERGED = { ...ALL_TAGS, get size() { return 1; } };',
      'const loadTags = (): number => cursor;',
      'if (COUNT) cursor = 1;',
      '',
      'export { ALL_TAGS, BUILT, COUNT, loadTags, MERGED };',
      '',
    ].join('\n');
    put(root, 'records/tags.ts', `${header('data')}${logic}`);
    const rules = await lintRules(root, 'records/tags.ts');
    expect(rules.filter((rule) => rule === 'brock/data-only')).toHaveLength(7);
  }, LINT_TIMEOUT_MS);
});
