/* @layer tooling-scripts @kind test */
import { mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { settleLineEndings, writeChanged } from '../src/write-changed.mjs';

const roots = [];

afterEach(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

const tempRoot = () => {
  const root = mkdtempSync(join(tmpdir(), 'brock-write-changed-'));
  roots.push(root);
  return root;
};

const OLD_TIME = new Date('2020-01-01T00:00:00Z');

describe('writeChanged line endings', () => {
  it('leaves a CRLF file with the same content untouched', () => {
    const root = tempRoot();
    const target = join(root, 'parts.ts');
    writeFileSync(target, 'one\r\ntwo\r\n');
    utimesSync(target, OLD_TIME, OLD_TIME);
    expect(writeChanged(root, [{ path: 'parts.ts', content: 'one\ntwo\n' }])).toEqual([]);
    expect(readFileSync(target, 'utf8')).toBe('one\r\ntwo\r\n');
    expect(statSync(target).mtimeMs).toBe(OLD_TIME.getTime());
  });

  it('writes a new or changed file with LF', () => {
    const root = tempRoot();
    expect(writeChanged(root, [{ path: '.brock/a.ts', content: 'one\r\ntwo\r\n' }])).toEqual(['.brock/a.ts']);
    expect(readFileSync(join(root, '.brock/a.ts'), 'utf8')).toBe('one\ntwo\n');
    writeFileSync(join(root, '.brock/a.ts'), 'old\r\n');
    expect(writeChanged(root, [{ path: '.brock/a.ts', content: 'new\r\n' }])).toEqual(['.brock/a.ts']);
    expect(readFileSync(join(root, '.brock/a.ts'), 'utf8')).toBe('new\n');
  });
});

describe('settleLineEndings', () => {
  it('puts back a file another tool rewrote with only the line endings changed', () => {
    const root = tempRoot();
    const target = join(root, 'parts.ts');
    writeFileSync(target, 'one\ntwo\n');
    expect(settleLineEndings(target, 'one\r\ntwo\r\n')).toBe(true);
    expect(readFileSync(target, 'utf8')).toBe('one\r\ntwo\r\n');
  });

  it('turns a changed or new file into LF and leaves an unchanged one alone', () => {
    const root = tempRoot();
    const target = join(root, 'parts.ts');
    writeFileSync(target, 'new\r\n');
    expect(settleLineEndings(target, 'old\r\n')).toBe(true);
    expect(readFileSync(target, 'utf8')).toBe('new\n');
    expect(settleLineEndings(target, 'new\n')).toBe(false);
    expect(settleLineEndings(join(root, 'missing.ts'), null)).toBe(false);
  });
});
