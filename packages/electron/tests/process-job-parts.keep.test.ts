/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { buildProcessEnv } from '../src/main/jobs/process/build-process-env';
import { checkProcessSpec } from '../src/main/jobs/process/check-process-spec';
import { cleanLine } from '../src/main/jobs/process/clean-line';
import { splitLines } from '../src/main/jobs/process/split-lines';

const ROOT = process.platform === 'win32' ? 'C:\\tools' : '/tools';
const COMMAND = process.execPath;

describe('buildProcessEnv', () => {
  it('keeps only allowlisted variables and adds what the app gives', () => {
    const base = { PATH: '/bin', Path: undefined, HOME: '/home/app', SECRET_TOKEN: 'abc', NODE_OPTIONS: '--inspect', ELECTRON_RUN_AS_NODE: '1' };
    const env = buildProcessEnv(base, { APP_MODE: 'install' });
    expect(env).toEqual({ PATH: '/bin', HOME: '/home/app', APP_MODE: 'install' });
  });

  it('matches names without regard to case and lets the app override', () => {
    const env = buildProcessEnv({ Path: 'C:\\bin', SystemRoot: 'C:\\Windows' }, { Path: 'C:\\app' });
    expect(env).toEqual({ Path: 'C:\\app', SystemRoot: 'C:\\Windows' });
  });
});

describe('splitLines and cleanLine', () => {
  it('splits on any line ending and keeps a partial line until it ends', () => {
    const seen: string[] = [];
    const splitter = splitLines((line) => seen.push(line), 100);
    splitter.push('one\r\ntwo\nthr');
    splitter.push('ee\rfour');
    expect(seen).toEqual(['one', 'two', 'three']);
    splitter.end();
    expect(seen).toEqual(['one', 'two', 'three', 'four']);
  });

  it('caps a line with no end instead of buffering it', () => {
    const seen: string[] = [];
    const splitter = splitLines((line) => seen.push(line), 10);
    splitter.push('a'.repeat(25));
    expect(seen).toEqual(['a'.repeat(10)]);
    splitter.end();
  });

  it('strips escape sequences and control characters', () => {
    const esc = String.fromCharCode(27);
    expect(cleanLine(`${esc}[31mred${esc}[0m\u0007 text\u0000`, 100)).toBe('red text');
    expect(cleanLine('a'.repeat(30), 10)).toBe(`${'a'.repeat(10)} [line cut]`);
  });
});

describe('checkProcessSpec', () => {
  it('accepts an absolute command with plain arguments', () => {
    expect(checkProcessSpec({ command: COMMAND, args: ['--flag', 'a value'], cwd: ROOT, env: { A_B: '1' } })).toBeNull();
  });

  it.each([
    ['a relative command', { command: 'node', args: [] }],
    ['an empty command', { command: '', args: [] }],
    ['a batch file', { command: `${ROOT}${process.platform === 'win32' ? '\\' : '/'}setup.cmd`, args: [] }],
    ['a null byte in an argument', { command: COMMAND, args: ['a\0b'] }],
    ['an argument that is not a string', { command: COMMAND, args: JSON.parse('[1]') as string[] }],
    ['a relative working directory', { command: COMMAND, args: [], cwd: 'here' }],
    ['a bad environment name', { command: COMMAND, args: [], env: { 'A=B': '1' } }],
    ['a bad environment value', { command: COMMAND, args: [], env: { A: 'x\0' } }],
  ])('rejects %s', (_name, spec) => {
    expect(checkProcessSpec(spec)).not.toBeNull();
  });
});
