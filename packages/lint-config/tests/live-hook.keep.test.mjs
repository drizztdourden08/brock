/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { LINT_TIMEOUT_MS, lintMessages, put, removeRoots, tempDir } from './lint-fixture.mjs';

const LIVE = [
  '/* @layer renderer-app @kind component */',
  "import type { LiveMeta, LivePage } from '@drizztdourden08/brock-react';",
  '',
  "const meta: LiveMeta = { icon: 'gamepad-2', empty: 'No controller connected' };",
  '',
  'const useLivePages = (): readonly LivePage[] => [];',
  '',
  'export default useLivePages;',
  'export { meta };',
  '',
].join('\n');

const HOOK_RULE = 'local/hook-file-named-after-hook';

const findings = async (file) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'live-hook', private: true, type: 'module' }));
  put(root, file, LIVE);
  return (await lintMessages(root, file)).map((message) => message.ruleId);
};

afterEach(removeRoots);

describe('a live hub file', () => {
  it('declares its hook and default-exports it without a finding', async () => {
    expect(await findings('src/screens/controllers/pads.live.tsx')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('does the same as a dev-only live file', async () => {
    expect(await findings('src/screens/controllers/pads.live.dev.tsx')).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('keeps the hook rule on any other file', async () => {
    expect(await findings('src/views/pads.tsx')).toContain(HOOK_RULE);
  }, LINT_TIMEOUT_MS);
});
