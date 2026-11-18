/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { join } from 'node:path';
import { brockEslint } from '../eslint.mjs';
import { LINT_TIMEOUT_MS, app, put, removeRoots } from './lint-fixture.mjs';

afterEach(removeRoots);

const RULE = 'brock/no-literal-text';
const HEADER = '/* @layer shared-game @kind logic */\n';

const messagesOf = async (root, file, extra) => {
  const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: brockEslint({ rootDir: root, typed: false, extra }) });
  const [result] = await eslint.lintFiles([join(root, file)]);
  return result.messages.filter((message) => message.ruleId === RULE).map((message) => message.message);
};

const literalHits = (root, file, options) => {
  const entry = { files: ['**/*.{ts,tsx}'], rules: { [RULE]: ['error', ...(options ? [options] : [])] } };
  return messagesOf(root, file, [entry]);
};

const literal = (text) => `User-visible text "${text}" is a literal. Put it in the locale table and use msg('ns:key').`;

const SCREEN = [
  HEADER,
  'const Save = () => <Button title="Save the file" aria-label={`Close`} icon="x" onClick={go}>Save</Button>;',
  "const ITEMS = [{ id: 'a', label: 'Open file', keywords: ['find', 'search'] }, { id: 'b', label: msg('app:open') }];",
  "const NUMBER = [{ id: 'c', label: '42', title: '...' }];",
  'export { Save, ITEMS, NUMBER };',
  '',
].join('\n');

describe('no-literal-text', () => {
  it('is off unless a consumer turns it on', { tags: ['critical'] }, async () => {
    const root = app();
    put(root, 'src/renderer/save.tsx', SCREEN);
    expect(await messagesOf(root, 'src/renderer/save.tsx')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('reports JSX text, text attributes and label properties, and skips msg, ids and symbols', { tags: ['critical'] }, async () => {
    const root = app();
    put(root, 'src/renderer/save.tsx', SCREEN);
    const hits = await literalHits(root, 'src/renderer/save.tsx');
    expect(hits).toEqual(['Save the file', 'Close', 'Save', 'Open file', 'find', 'search'].map(literal));
  }, LINT_TIMEOUT_MS);

  it('reports label properties in a constants file and skips test files', { tags: ['standard'] }, async () => {
    const root = app();
    const constants = `/* @layer shared-game @kind constants */\nconst TABS = [{ id: 'a', title: 'General' }];\n\nexport { TABS };\n`;
    put(root, 'src/settings/tabs.constants.ts', constants);
    put(root, 'src/settings/tabs.test.ts', constants);
    expect(await literalHits(root, 'src/settings/tabs.constants.ts')).toEqual([literal('General')]);
    expect(await literalHits(root, 'src/settings/tabs.test.ts')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('takes attribute and property lists and an ignore list as options', { tags: ['standard'] }, async () => {
    const root = app();
    put(root, 'src/renderer/save.tsx', SCREEN);
    const hits = await literalHits(root, 'src/renderer/save.tsx', { attributes: [], properties: ['label'], ignore: ['^Save$', '^Open'] });
    expect(hits).toEqual([]);
  }, LINT_TIMEOUT_MS);
});
