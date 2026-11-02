/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { CONTENT, ensureGitattributes } from '../src/commands/adopt-gitattributes.mjs';

const made = [];

const emptyRepo = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-gitattributes-'));
  made.push(root);
  return root;
};

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('K1 ensureGitattributes', { tags: ['critical'] }, () => {
  it('writes the file with LF endings when it is missing', () => {
    const root = emptyRepo();
    expect(ensureGitattributes(root)).toBe(true);
    expect(readFileSync(join(root, '.gitattributes'), 'utf8').split('\n')[0]).toBe('* text=auto eol=lf');
  });

  it('keeps a file the repo already has', () => {
    const root = emptyRepo();
    writeFileSync(join(root, '.gitattributes'), 'pnpm-lock.yaml text eol=lf\n');
    expect(ensureGitattributes(root)).toBe(false);
    expect(readFileSync(join(root, '.gitattributes'), 'utf8')).toBe('pnpm-lock.yaml text eol=lf\n');
  });

  it('matches the file the app and server templates ship', () => {
    const app = resolve(import.meta.dirname, '../../../templates/app/.gitattributes');
    const server = resolve(import.meta.dirname, '../../create-brock/template-server/.gitattributes');
    expect(readFileSync(app, 'utf8')).toBe(CONTENT);
    expect(readFileSync(server, 'utf8')).toBe(CONTENT);
  });
});
