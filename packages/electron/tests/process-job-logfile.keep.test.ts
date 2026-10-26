/* @layer electron-main @kind test */
import { existsSync, mkdirSync, readdirSync, readFileSync, utimesSync, writeFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createProcessFixture } from './process-job-fixture';
import type { ProcessFixture } from './process-job-fixture';

let fx: ProcessFixture;

beforeEach(() => {
  fx = createProcessFixture();
});

afterEach(() => {
  fx.dispose();
});

const logFileOf = (outcome: { logFile?: string }): string => {
  expect(outcome.logFile).toBeTypeOf('string');
  return readFileSync(outcome.logFile as string, 'utf8');
};

describe('process job log file', () => {
  it('keeps the whole output in a file under the debug folder while the tail stays at 20 lines', async () => {
    const outcome = await fx.processes.run('build:full', { command: fx.command, args: fx.argv('flood', '100') }, { label: 'Build' });
    expect(outcome).toMatchObject({ status: 'failed', exitCode: 3 });
    if (outcome.status === 'rejected') throw new Error('rejected');
    expect(outcome.tail).toHaveLength(20);
    expect(outcome.logFile?.startsWith(fx.logDir)).toBe(true);
    expect(outcome.logFile).toMatch(/build_full-.*\.log$/);
    const lines = logFileOf(outcome).split('\n');
    expect(lines.slice(0, 3)).toEqual(['line-1', 'line-2', 'line-3']);
    expect(lines.slice(-2)).toEqual(['END', '']);
    expect(lines).toHaveLength(102);
  });

  it('writes the redacted line, never the raw one', async () => {
    const redact = (line: string): string => line.replace('pass1234', '****');
    const outcome = await fx.processes.run('secret', { command: fx.command, args: fx.argv('echo', 'pass1234') }, { label: 'Secret', redact });
    expect(logFileOf(outcome as { logFile?: string })).toBe('ECHO ****\n');
  });

  it('reports no log file when logFile is false', async () => {
    const outcome = await fx.processes.run('off', { command: fx.command, args: fx.argv('flood', '5') }, { label: 'Off', logFile: false });
    expect(outcome).toMatchObject({ status: 'failed' });
    expect(outcome).not.toHaveProperty('logFile');
    expect(existsSync(fx.logDir)).toBe(false);
  });

  it('reports no log file when log is false, so secret output never reaches the disk', async () => {
    const outcome = await fx.processes.run('quiet', { command: fx.command, args: fx.argv('echo', 'token') }, { label: 'Quiet', log: false });
    expect(outcome).toMatchObject({ status: 'done', tail: [] });
    expect(outcome).not.toHaveProperty('logFile');
    expect(existsSync(fx.logDir)).toBe(false);
  });

  it('reports no log file when the process wrote nothing', async () => {
    const outcome = await fx.processes.run('silent', { command: fx.command, args: fx.argv('exit', '0') }, { label: 'Silent' });
    expect(outcome).toMatchObject({ status: 'done' });
    expect(outcome).not.toHaveProperty('logFile');
  });

});

describe('process job log file bounds', () => {
  it('keeps the start and the end of an oversized log and notes what was left out', async () => {
    const outcome = await fx.processes.run('big', { command: fx.command, args: fx.argv('flood', '2000') }, { label: 'Big', logFile: { maxBytes: 1000 } });
    const text = logFileOf(outcome as { logFile?: string });
    const lines = text.split('\n');
    expect(lines[0]).toBe('line-1');
    expect(lines.at(-2)).toBe('END');
    expect(text).toMatch(/\[\d+ lines \(\d+ bytes\) omitted from the middle of the log\]/);
    expect(lines).not.toContain('line-1000');
    expect(Buffer.byteLength(text)).toBeLessThan(1000 + 100);
  });

  it('rejects a cap that is not a positive whole number', async () => {
    const outcome = await fx.processes.run('bad', { command: fx.command, args: fx.argv('exit', '0') }, { label: 'Bad', logFile: { maxBytes: 0 } });
    expect(outcome).toMatchObject({ status: 'rejected', error: 'logFile.maxBytes must be a positive whole number.' });
  });

  it('prunes old log files so the folder keeps at most 20', async () => {
    mkdirSync(fx.logDir, { recursive: true });
    for (let index = 0; index < 25; index += 1) {
      const file = join(fx.logDir, `old-${String(index).padStart(2, '0')}.log`);
      writeFileSync(file, 'old\n');
      const time = new Date(Date.now() - (100 - index) * 60_000);
      utimesSync(file, time, time);
    }
    writeFileSync(join(fx.logDir, 'notes.txt'), 'not a log');
    const outcome = await fx.processes.run('fresh', { command: fx.command, args: fx.argv('echo', 'hi') }, { label: 'Fresh' });
    const names = readdirSync(fx.logDir).filter((name) => name.endsWith('.log'));
    expect(names).toHaveLength(20);
    expect(names).toContain(join(outcome.status === 'rejected' ? '' : (outcome.logFile ?? '')).split(/[\\/]/).at(-1));
    expect(names).not.toContain('old-00.log');
    expect(names).toContain('old-24.log');
    expect(existsSync(join(fx.logDir, 'notes.txt'))).toBe(true);
  });
});
