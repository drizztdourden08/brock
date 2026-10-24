/* @layer electron-main @kind test */
import { EventEmitter } from 'events';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { RunServerOptions } from '../src/server/run-server.type';
import type { RunningServer, ServerStart } from '../src/server/server-host.type';

interface Harness {
  root: string;
  dataDir: string;
  options: RunServerOptions;
  out: string[];
  err: string[];
  signals: EventEmitter;
  exitCodes: number[];
  clock: { value: number };
  healthOptions: RunServerOptions;
}

const roots: string[] = [];

const removeHarnessRoots = async (): Promise<void> => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
};

const createHarness = async (): Promise<Harness> => {
  const root = await mkdtemp(join(tmpdir(), 'brock-server-'));
  roots.push(root);
  const dataDir = join(root, 'data');
  const out: string[] = [];
  const err: string[] = [];
  const signals = new EventEmitter();
  const exitCodes: number[] = [];
  const clock = { value: 1_000_000 };
  const options: RunServerOptions = {
    argv: [`--user-data=${dataDir}`],
    env: {},
    cwd: root,
    stdout: { write: (text) => out.push(text) },
    stderr: { write: (text) => err.push(text) },
    signals,
    now: () => clock.value,
    heartbeatMs: 3_600_000,
    setExitCode: (code) => exitCodes.push(code),
  };
  return { root, dataDir, options, out, err, signals, exitCodes, clock, healthOptions: { ...options, argv: [`--user-data=${dataDir}`, 'health'] } };
};

const idle = (overrides: Partial<RunningServer> = {}): ServerStart => () => ({ stop: () => undefined, ...overrides });

export { createHarness, idle, removeHarnessRoots };
