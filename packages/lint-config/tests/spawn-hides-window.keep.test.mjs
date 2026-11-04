/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { LINT_TIMEOUT_MS, app, header, lintMessages, put, removeRoots } from './lint-fixture.mjs';

afterEach(removeRoots);

const hideMessages = async (body) => {
  const root = app();
  put(root, 'run.mjs', `${header('logic')}${body}\n`);
  return (await lintMessages(root, 'run.mjs')).filter((message) => message.ruleId === 'brock/spawn-hides-window');
};

describe('the spawn-hides-window rule', () => {
  it('passes a call whose options object has windowsHide true', { tags: ['critical'] }, async () => {
    const found = await hideMessages("import { execFileSync } from 'node:child_process';\nexecFileSync('git', ['status'], { cwd: '.', windowsHide: true });\n");
    expect(found).toEqual([]);
  }, LINT_TIMEOUT_MS);

  it('reports a call whose options object lacks windowsHide', { tags: ['critical'] }, async () => {
    const found = await hideMessages("import { spawn } from 'node:child_process';\nspawn('git', [], { cwd: '.' });\n");
    expect(found).toHaveLength(1);
    expect(found[0].message).toMatch(/windowsHide: true/);
  }, LINT_TIMEOUT_MS);

  it('reports windowsHide false', { tags: ['critical'] }, async () => {
    const found = await hideMessages("import { spawn } from 'child_process';\nspawn('git', [], { windowsHide: false });\n");
    expect(found).toHaveLength(1);
  }, LINT_TIMEOUT_MS);

  it('follows a renamed import, a namespace import and options held in a variable', { tags: ['critical'] }, async () => {
    const found = await hideMessages([
      "import { execFileSync as exec } from 'node:child_process';",
      "import * as cp from 'node:child_process';",
      "const options = { windowsHide: true };",
      "exec('git', [], { cwd: '.' });",
      "cp.execSync('ls', options);",
      "cp.execSync('ls', { ...options, windowsHide: true });",
    ].join('\n'));
    expect(found).toHaveLength(2);
  }, LINT_TIMEOUT_MS);

  it('reports a call with no options', { tags: ['critical'] }, async () => {
    const found = await hideMessages("import { execSync } from 'node:child_process';\nexecSync('ls');\n");
    expect(found).toHaveLength(1);
  }, LINT_TIMEOUT_MS);
});
