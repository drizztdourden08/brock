/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createProcessFixture } from './process-job-fixture';
import type { ProcessFixture } from './process-job-fixture';
import type { ProcessProgressParser } from '../src/main/jobs/process/process-job.type';

const WAIT = { timeout: 15_000, interval: 50 };
const FAST_CANCEL = { graceMs: 300 };

let fx: ProcessFixture;

beforeEach(() => {
  fx = createProcessFixture();
});

afterEach(() => {
  fx.dispose();
});

const defineEcho = (): void => {
  fx.processes.define('echo', {
    label: 'Echo',
    parse: (raw) => {
      if (typeof raw !== 'object' || raw === null || !('text' in raw) || typeof raw.text !== 'string' || raw.text.length > 100) throw new Error('text is required');
      return raw.text;
    },
    resolve: (text) => ({ command: fx.command, args: fx.argv('echo', text) }),
  });
};

const alive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const percent: ProcessProgressParser = (line) => {
  const match = /^PROGRESS (\d+) (.*)$/.exec(line);
  return match?.[1] ? { fraction: Number(match[1]) / 100, label: match[2] } : null;
};

describe('run a process as a job: output and exit', () => {
  it('streams stdout and stderr lines to the job log and returns the tail', async () => {
    const outcome = await fx.processes.run('lines', { command: fx.command, args: fx.argv('lines') }, { label: 'Lines' });
    expect(outcome.status).toBe('done');
    expect(fx.snapshot('lines')?.state).toBe('done');
    const log = fx.lines('lines');
    expect(log.find((line) => line.message === 'alpha')?.level).toBe('info');
    expect(log.find((line) => line.message === 'bravo')?.level).toBe('warn');
    const long = log.find((line) => line.message.startsWith('xxx'));
    expect(long?.message.length).toBe(4096);
    if (outcome.status === 'done') expect(outcome.tail.slice(0, 2)).toEqual(['alpha', 'bravo']);
  });

  it('reports progress from the parser while the process runs', async () => {
    const running = fx.processes.run('half', { command: fx.command, args: fx.argv('half') }, { label: 'Half', progress: percent, cancel: FAST_CANCEL });
    await vi.waitFor(() => expect(fx.snapshot('half')).toMatchObject({ progress: 0.5, line: 'half way' }), WAIT);
    fx.jobs.cancel('half');
    expect((await running).status).toBe('cancelled');
  });

  it('keeps going when the progress parser throws', async () => {
    const progress: ProcessProgressParser = () => {
      throw new Error('bad parser');
    };
    const outcome = await fx.processes.run('lines', { command: fx.command, args: fx.argv('lines') }, { label: 'Lines', progress });
    expect(outcome.status).toBe('done');
  });

  it('is done on exit code 0 and failed on another code, with the code and the job error', async () => {
    const ok = await fx.processes.run('ok', { command: fx.command, args: fx.argv('exit', '0') }, { label: 'Ok' });
    expect(ok).toMatchObject({ status: 'done', exitCode: 0 });
    const bad = await fx.processes.run('bad', { command: fx.command, args: fx.argv('exit', '3') }, { label: 'Bad' });
    expect(bad).toMatchObject({ status: 'failed', exitCode: 3, error: 'Bad exited with code 3.' });
    expect(fx.snapshot('bad')).toMatchObject({ state: 'failed', error: 'Bad exited with code 3.' });
  });

  it('counts the exit codes the app lists as success', async () => {
    const outcome = await fx.processes.run('three', { command: fx.command, args: fx.argv('exit', '3') }, { label: 'Three', successCodes: [0, 3] });
    expect(outcome).toMatchObject({ status: 'done', exitCode: 3 });
  });

  it('fails the job with a clear message when the program cannot start', async () => {
    const command = process.platform === 'win32' ? `${fx.dir}\\missing.exe` : `${fx.dir}/missing`;
    const outcome = await fx.processes.run('missing', { command, args: [] }, { label: 'Missing' });
    expect(outcome).toMatchObject({ status: 'failed', exitCode: null });
    if (outcome.status === 'failed') expect(outcome.error).toMatch(/^Missing could not start: /);
    expect(fx.snapshot('missing')?.state).toBe('failed');
  });

  it('notes that an installer may show its own prompt, and nothing more', async () => {
    await fx.processes.run('setup', { command: fx.command, args: fx.argv('exit', '0') }, { label: 'Setup', elevate: 'installer' });
    expect(fx.messages('setup')).toContain('This installer may show its own system prompt.');
  });
});

describe('run a process as a job: environment and argv', () => {
  it('starts from the allowlist and adds only what the app gives', async () => {
    vi.stubEnv('BROCK_PROCESS_SECRET', 'hidden');
    const outcome = await fx.processes.run('env', { command: fx.command, args: fx.argv('env'), env: { APP_ADDED: '1' } }, { label: 'Env' });
    vi.unstubAllEnvs();
    expect(outcome.status).toBe('done');
    const names = (fx.messages('env').find((line) => line.startsWith('ENV ')) ?? '').slice(4).split(',');
    expect(names).toContain('APP_ADDED');
    expect(names).not.toContain('BROCK_PROCESS_SECRET');
  });

  it('passes an argument as one argv entry with no shell interpolation', async () => {
    const outcome = await fx.processes.run('echo', { command: fx.command, args: fx.argv('echo', '& echo pwned; $(id) "q"') }, { label: 'Echo' });
    expect(outcome.status).toBe('done');
    expect(fx.messages('echo')).toContain('ECHO & echo pwned; $(id) "q"');
  });

  it('refuses a spec that is not a safe argv without starting anything', async () => {
    const relative = await fx.processes.run('rel', { command: 'node', args: [] }, { label: 'Rel' });
    expect(relative.status).toBe('rejected');
    expect(fx.snapshot('rel')).toBeUndefined();
  });
});

describe('run a process as a job: cancel and one at a time', () => {
  const childLine = (): string => fx.messages('tree').find((line) => line.startsWith('CHILD ')) ?? '';

  it('cancel ends the whole process tree', async () => {
    const running = fx.processes.run('tree', { command: fx.command, args: fx.argv('tree') }, { label: 'Tree', cancel: FAST_CANCEL });
    await vi.waitFor(() => expect(childLine()).not.toBe(''), WAIT);
    const pid = Number(childLine().slice(6));
    expect(alive(pid)).toBe(true);
    fx.jobs.cancel('tree');
    expect((await running).status).toBe('cancelled');
    expect(fx.snapshot('tree')?.state).toBe('cancelled');
    await vi.waitFor(() => expect(alive(pid)).toBe(false), WAIT);
  });

  it('runs one process per job id at a time', async () => {
    const first = fx.processes.run('one', { command: fx.command, args: fx.argv('hold') }, { label: 'One', cancel: FAST_CANCEL });
    const second = await fx.processes.run('one', { command: fx.command, args: fx.argv('exit', '0') }, { label: 'One' });
    expect(second).toMatchObject({ status: 'rejected', error: 'job "one" is already running' });
    fx.jobs.cancel('one');
    expect((await first).status).toBe('cancelled');
  });

  it('cancels every running process when the app quits', async () => {
    const running = fx.processes.run('quit', { command: fx.command, args: fx.argv('hold') }, { label: 'Quit', cancel: FAST_CANCEL });
    await vi.waitFor(() => expect(fx.messages('quit')).toContain('READY'), WAIT);
    fx.processes.cancelAll();
    expect((await running).status).toBe('cancelled');
  });
});

describe('run a process as a job: what a renderer can start', () => {
  it('rejects a job id main never defined', async () => {
    defineEcho();
    expect(await fx.processes.start('format-disk', { text: 'x' })).toMatchObject({ status: 'rejected', error: 'No such process job.' });
    expect(await fx.processes.start(JSON.parse('{"id":1}') as string)).toMatchObject({ status: 'rejected' });
    expect(fx.jobs.list()).toHaveLength(0);
  });

  it('rejects invalid arguments before the resolver runs', async () => {
    const resolve = vi.fn(() => ({ command: fx.command, args: [] }));
    fx.processes.define('strict', { label: 'Strict', parse: (raw) => {
      if (typeof raw !== 'string') throw new Error('a string is needed');
      return raw;
    }, resolve });
    const outcome = await fx.processes.start('strict', { command: 'evil' });
    expect(outcome).toMatchObject({ status: 'rejected', error: 'Invalid arguments: a string is needed' });
    expect(resolve).not.toHaveBeenCalled();
    expect(fx.jobs.list()).toHaveLength(0);
  });

  it('runs a defined job with arguments the schema accepted', async () => {
    defineEcho();
    const outcome = await fx.processes.start('echo', { text: 'hello' });
    expect(outcome.status).toBe('done');
    expect(fx.messages('echo')).toContain('ECHO hello');
  });

  it('refuses to define the same id twice or an id with odd characters', () => {
    defineEcho();
    expect(() => defineEcho()).toThrow(/already defined/);
    expect(() => fx.processes.define('../x', { label: 'X', parse: () => 1, resolve: () => ({ command: fx.command, args: [] }) })).toThrow(/not a valid/);
  });
});
