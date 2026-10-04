/* @layer tooling-scripts @kind test */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ignoreGenerated } from '../src/commands/adopt-gitignore.mjs';

const made = [];

const put = (root, file, text) => {
  const path = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};

const gitRepo = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-gitignore-'));
  made.push(root);
  Object.entries(files).forEach(([file, text]) => put(root, file, text));
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  return root;
};

const linesOf = (root) => readFileSync(join(root, '.gitignore'), 'utf8').split('\n');
const ignored = (root) => execFileSync('git', ['ls-files', '-ci', '--exclude-standard'], { cwd: root, encoding: 'utf8' });

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('ignoreGenerated', () => {
  it('ignores every dot-folder, keeps the tracked ones and drops single dot-folder lines', () => {
    const root = gitRepo({ '.gitignore': 'node_modules/\n.vite/\n', '.storybook/main.ts': 'x', 'app/.config/a.json': 'x', '.brock/screens.ts': 'x' });
    ignoreGenerated(root);
    const lines = linesOf(root);
    expect(lines).not.toContain('.vite/');
    expect(lines).toEqual(expect.arrayContaining(['.*/', '!.github/', '!.brock/', '!.storybook/', '!app/.config/', 'node_modules/', 'dist/']));
    expect(lines.indexOf('.*/')).toBeLessThan(lines.indexOf('!.storybook/'));
    expect(ignored(root)).toBe('');
  });

  it('adds nothing the second time', () => {
    const root = gitRepo({ 'a.txt': 'x' });
    ignoreGenerated(root);
    expect(ignoreGenerated(root)).toEqual([]);
  });
});
