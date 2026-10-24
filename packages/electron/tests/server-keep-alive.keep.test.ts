/* @layer electron-main @kind test */
import { fork } from 'child_process';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { afterEach, describe, expect, it } from 'vitest';

const CHILD = resolve(import.meta.dirname, 'keep-alive/starter-child.mjs');
const PAST_TWO_HEARTBEATS_MS = 200;
const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const startChild = async (): Promise<{ child: ReturnType<typeof fork>; exit: Promise<number | null> }> => {
  const root = await mkdtemp(join(tmpdir(), 'brock-keep-'));
  roots.push(root);
  const child = fork(CHILD, [`--user-data=${join(root, 'data')}`], { stdio: ['ignore', 'ignore', 'inherit', 'ipc'] });
  const exit = new Promise<number | null>((done) => child.once('exit', (code) => done(code)));
  await new Promise<void>((ready) => child.once('message', () => ready()));
  return { child, exit };
};

describe('a server whose start function holds nothing open', () => {
  it('stays up past two heartbeats, and exits with code 0 once stopped', async () => {
    const { child, exit } = await startChild();
    const early = await Promise.race([exit, new Promise<'alive'>((alive) => setTimeout(() => alive('alive'), PAST_TWO_HEARTBEATS_MS))]);
    expect(early).toBe('alive');
    if (process.platform === 'win32') child.send('stop');
    else child.kill('SIGTERM');
    expect(await exit).toBe(0);
  }, 20_000);
});
