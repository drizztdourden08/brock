/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { join } from 'node:path';
import { brockEslint } from '../eslint.mjs';
import { LINT_TIMEOUT_MS, header, put, removeRoots, tempDir } from './lint-fixture.mjs';

afterEach(removeRoots);

const RULE = 'local/no-slop-identifiers';

const fixture = (config) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'allow-fixture', private: true, type: 'module' }));
  put(root, 'src/record.type.ts', `${header('types')}type Record = { claudeId: string };\n\nexport type { Record };\n`);
  if (config) put(root, 'standards.config.mjs', `export default ${JSON.stringify(config)};\n`);
  return root;
};

const ruleOptions = (root, options) => brockEslint({ rootDir: root, typed: false, ...options }).map((block) => block.rules?.[RULE]).find(Boolean);

const lintRules = async (root, options) => {
  const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: brockEslint({ rootDir: root, typed: false, ...options }) });
  const [result] = await eslint.lintFiles([join(root, 'src', 'record.type.ts')]);
  return result.messages.map((message) => message.ruleId);
};

describe('allowing an identifier', () => {
  it('flags the name when nothing allows it', async () => {
    const root = fixture();
    expect(ruleOptions(root, {})).toEqual(['error', { allow: [] }]);
    expect(await lintRules(root, {})).toEqual([RULE]);
  }, LINT_TIMEOUT_MS);

  it.each([
    ['a top-level allow', {}, { allow: ['claudeId'] }],
    ['a prose allow', {}, { prose: { allow: ['claudeId'] } }],
    ['both shapes', {}, { allow: ['claudeId'], prose: { allow: ['otherId'] } }],
    ['options.allow in standards.config.mjs', { options: { allow: ['claudeId'] } }, {}],
    ['options.prose.allow in standards.config.mjs', { options: { prose: { allow: ['claudeId'] } } }, {}],
  ])('lets the name through with %s', async (_label, config, options) => {
    const root = fixture(config.options ? config : undefined);
    expect(ruleOptions(root, options)[1].allow).toContain('claudeId');
    expect(await lintRules(root, options)).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('joins the two shapes', () => {
    const root = fixture();
    expect(ruleOptions(root, { allow: ['aaId'], prose: { allow: ['bbId'] } })[1].allow).toEqual(['aaId', 'bbId']);
  });
});
