/* @layer electron-main @kind test */
import { describe, expect, it } from 'vitest';
import { buildProcessEnv } from '../src/main/jobs/process/build-process-env';
import { checkProcessSpec } from '../src/main/jobs/process/check-process-spec';
import { cleanLine } from '../src/main/jobs/process/clean-line';
import { exitOutcome } from '../src/main/jobs/process/exit-outcome';
import { splitLines } from '../src/main/jobs/process/split-lines';

const TOOL = '/opt/tool/setup';
const WIN_TOOL = 'C:\\tools\\setup.exe';
const ESC = String.fromCharCode(27);
const BEL = String.fromCharCode(7);

describe('buildProcessEnv', () => {
  it('keeps only allowlisted variables and adds what the app gives', () => {
    const base = { PATH: '/bin', Path: undefined, HOME: '/home/app', SECRET_TOKEN: 'abc', NODE_OPTIONS: '--inspect', ELECTRON_RUN_AS_NODE: '1' };
    const env = buildProcessEnv(base, { APP_MODE: 'install' }, 'linux');
    expect(env).toEqual({ PATH: '/bin', HOME: '/home/app', APP_MODE: 'install' });
  });

  it('matches names without regard to case on Windows, so the app value replaces the inherited one', () => {
    const env = buildProcessEnv({ Path: 'C:\\bin', SystemRoot: 'C:\\Windows' }, { PATH: 'C:\\app' }, 'win32');
    expect(env).toEqual({ PATH: 'C:\\app', SystemRoot: 'C:\\Windows' });
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
    expect(cleanLine(`${ESC}[31mred${ESC}[0m${BEL} text\u0000`, 100)).toBe('red text');
    expect(cleanLine('a'.repeat(30), 10)).toBe(`${'a'.repeat(10)} [line cut]`);
  });

  it('strips OSC sequences, C1 controls and bidi overrides', () => {
    expect(cleanLine(`${ESC}]0;fake title${BEL}shown`, 100)).toBe('shown');
    expect(cleanLine(`${ESC}]8;;http://evil${ESC}\\link${ESC}]8;;${ESC}\\`, 100)).toBe('link');
    expect(cleanLine('a\u0085b\u009bc', 100)).toBe('abc');
    expect(cleanLine('exe\u202Efdp.txt\u2066x\u2069', 100)).toBe('exefdp.txtx');
  });
});

describe('checkProcessSpec on a POSIX host', () => {
  it('accepts an absolute command with plain arguments', () => {
    expect(checkProcessSpec({ command: TOOL, args: ['--flag', 'a value'], cwd: '/opt', env: { A_B: '1' } }, {}, 'linux')).toBeNull();
  });

  it.each([
    ['a relative command', { command: 'node', args: [] }],
    ['an empty command', { command: '', args: [] }],
    ['a null byte in an argument', { command: TOOL, args: ['a\0b'] }],
    ['an argument that is not a string', { command: TOOL, args: JSON.parse('[1]') as string[] }],
    ['a relative working directory', { command: TOOL, args: [], cwd: 'here' }],
    ['a bad environment name', { command: TOOL, args: [], env: { 'A=B': '1' } }],
    ['a bad environment value', { command: TOOL, args: [], env: { A: 'x\0' } }],
    ['an interpreter', { command: '/usr/bin/pwsh', args: [] }],
  ])('rejects %s', (_name, spec) => {
    expect(checkProcessSpec(spec, {}, 'linux')).not.toBeNull();
  });

  it('lets a definition allow an interpreter', () => {
    expect(checkProcessSpec({ command: '/usr/bin/pwsh', args: [] }, { interpreters: true }, 'linux')).toBeNull();
  });
});

describe('checkProcessSpec on Windows', () => {
  it('accepts a normalised drive letter .exe path', () => {
    expect(checkProcessSpec({ command: WIN_TOOL, args: [], cwd: 'C:\\work' }, {}, 'win32')).toBeNull();
    expect(checkProcessSpec({ command: 'C:/tools/../tools/setup.COM', args: [] }, {}, 'win32')).toBeNull();
  });

  it.each([
    ['a batch file', 'C:\\tools\\setup.bat'],
    ['a program with no extension', 'C:\\tools\\setup'],
    ['an alternate data stream', 'C:\\tools\\setup.exe:stream.exe'],
    ['a UNC path', '\\\\server\\share\\setup.exe'],
    ['a device path', '\\\\?\\C:\\tools\\setup.exe'],
    ['a root-relative path', '\\tools\\setup.exe'],
    ['a drive-relative path', 'C:setup.exe'],
    ['cmd', 'C:\\Windows\\System32\\cmd.exe'],
    ['PowerShell', 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'],
    ['msiexec', 'C:\\Windows\\System32\\MSIEXEC.EXE'],
    ['mshta', 'C:\\Windows\\System32\\mshta.exe'],
  ])('rejects %s', (_name, command) => {
    expect(checkProcessSpec({ command, args: [] }, {}, 'win32')).not.toBeNull();
  });

  it('lets a definition allow network paths or interpreters, and still refuses a data stream', () => {
    expect(checkProcessSpec({ command: '\\\\server\\share\\setup.exe', args: [] }, { network: true }, 'win32')).toBeNull();
    expect(checkProcessSpec({ command: '\\\\?\\C:\\tools\\setup.exe', args: [] }, { network: true }, 'win32')).toBeNull();
    expect(checkProcessSpec({ command: 'C:\\Windows\\System32\\msiexec.exe', args: ['/i', 'a.msi'] }, { interpreters: true }, 'win32')).toBeNull();
    expect(checkProcessSpec({ command: '\\\\server\\share\\a.exe:s', args: [] }, { network: true }, 'win32')).not.toBeNull();
  });
});

describe('checkProcessSpec environment', () => {
  it.each(['NODE_OPTIONS', 'ELECTRON_RUN_AS_NODE', 'LD_PRELOAD', 'DYLD_INSERT_LIBRARIES', 'PATH'])('refuses %s unless the definition allows it', (name) => {
    expect(checkProcessSpec({ command: TOOL, args: [], env: { [name]: 'x' } }, {}, 'linux')).toBe(`The environment may not set ${name}.`);
    expect(checkProcessSpec({ command: TOOL, args: [], env: { [name]: 'x' } }, { env: [name] }, 'linux')).toBeNull();
  });

  it('matches names without regard to case on Windows and refuses a name given twice', () => {
    expect(checkProcessSpec({ command: WIN_TOOL, args: [], env: { node_options: '--x' } }, {}, 'win32')).not.toBeNull();
    expect(checkProcessSpec({ command: WIN_TOOL, args: [], env: { Path: 'a' } }, {}, 'win32')).not.toBeNull();
    expect(checkProcessSpec({ command: WIN_TOOL, args: [], env: { Path: 'a', PATH: 'b' } }, { env: ['PATH'] }, 'win32')).not.toBeNull();
  });
});

describe('exitOutcome', () => {
  const base = { code: 0, signal: null, killed: false, timedOut: false, tail: [] };

  it('says done for a success exit that came before any kill', () => {
    expect(exitOutcome({ label: 'Job' }, base).status).toBe('done');
  });

  it('says cancelled only when the kill ended the process', () => {
    expect(exitOutcome({ label: 'Job' }, { ...base, code: 1, killed: true }).status).toBe('cancelled');
  });

  it('says failed with a timed out message when the time ran out', () => {
    expect(exitOutcome({ label: 'Job' }, { ...base, code: 1, killed: true, timedOut: true })).toMatchObject({ status: 'failed', error: 'Job timed out.' });
  });
});
