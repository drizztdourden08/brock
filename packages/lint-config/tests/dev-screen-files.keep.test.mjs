/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';
import { brockEslint } from '../eslint.mjs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';

const LINT_TIMEOUT_MS = 60000;
const SCREEN_RULES = new Set(['no-restricted-syntax', 'local/one-export-per-file']);

const roots = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));

const SCREEN = [
  '/* @layer renderer-app @kind component */',
  "import type { ScreenMeta } from '@drizztdourden08/brock-react';",
  '',
  "const meta: ScreenMeta = { title: 'Inspector', icon: 'bug' };",
  '',
  'const InspectorScreen = () => <p>{meta.title}</p>;',
  '',
  'export default InspectorScreen;',
  'export { meta };',
  '',
].join('\n');

const screenFindings = async (file) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-dev-screens-'));
  roots.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'dev-screens', private: true, type: 'module' }));
  mkdirSync(dirname(join(root, file)), { recursive: true });
  writeFileSync(join(root, file), SCREEN);
  const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: brockEslint({ rootDir: root, typed: false }) });
  const [result] = await eslint.lintFiles([join(root, file)]);
  return result.messages.filter((message) => SCREEN_RULES.has(message.ruleId)).map((message) => message.ruleId);
};

describe('dev-only screen files', () => {
  it('take the default export and the meta export of a screen file', async () => {
    for (const file of ['src/screens/tools/inspector.page.dev.tsx', 'src/screens/tools/inspector/state.tab.dev.tsx', 'src/screens/debug.card.dev.tsx']) {
      expect(await screenFindings(file), file).toEqual([]);
    }
  }, LINT_TIMEOUT_MS);

  it('stay a screen file only under src/screens', async () => {
    expect(await screenFindings('src/views/inspector.page.dev.tsx')).not.toEqual([]);
  }, LINT_TIMEOUT_MS);
});
