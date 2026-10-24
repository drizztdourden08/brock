/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { startApp } from '../src/bridge';

const spawned = vi.hoisted(() => ({ calls: [] as unknown[][], child: null as EventEmitter | null }));
vi.mock('child_process', () => ({
  spawn: (...call: unknown[]) => {
    spawned.calls.push(call);
    return spawned.child;
  },
}));

const fakeChild = (): EventEmitter & { pid: number; unref: ReturnType<typeof vi.fn> } => {
  const child = Object.assign(new EventEmitter(), { pid: 4321, unref: vi.fn() });
  spawned.child = child;
  return child;
};

afterEach(() => {
  spawned.calls.length = 0;
  vi.unstubAllEnvs();
});

describe('startApp', () => {
  it('starts the app detached with no ELECTRON_RUN_AS_NODE, which a helper runs under, and with the launch env on top', async () => {
    vi.stubEnv('ELECTRON_RUN_AS_NODE', '1');
    vi.stubEnv('KEEP_ME', 'yes');
    const child = fakeChild();
    const started = startApp({ command: process.execPath, args: ['--background'], env: { EXTRA: '1' } });
    child.emit('spawn');
    await expect(started).resolves.toBe(4321);
    const [command, args, options] = spawned.calls[0] as [string, string[], { env: Record<string, string>; detached: boolean; stdio: string }];
    expect([command, args, options.detached, options.stdio]).toEqual([process.execPath, ['--background'], true, 'ignore']);
    expect(options.env).not.toHaveProperty('ELECTRON_RUN_AS_NODE');
    expect(options.env).toMatchObject({ KEEP_ME: 'yes', EXTRA: '1' });
    expect(child.unref).toHaveBeenCalledOnce();
  });

  it('drops ELECTRON_RUN_AS_NODE and NODE_OPTIONS whatever their case, from the inherited env and from the launch env', async () => {
    vi.stubEnv('Electron_Run_As_Node', '1');
    vi.stubEnv('node_options', '--require x');
    vi.stubEnv('KEEP_ME', 'yes');
    const child = fakeChild();
    const started = startApp({ command: process.execPath, args: [], env: { electron_run_as_node: '1', Node_Options: '--inspect' } });
    child.emit('spawn');
    await started;
    const env = (spawned.calls[0]?.[2] as { env: Record<string, string> }).env;
    expect(Object.keys(env).filter((key) => ['ELECTRON_RUN_AS_NODE', 'NODE_OPTIONS'].includes(key.toUpperCase()))).toEqual([]);
    expect(env.KEEP_ME).toBe('yes');
  });

  it('says so, and spawns nothing, when the executable is gone', async () => {
    await expect(startApp({ command: join(tmpdir(), 'brock-no-such-app', 'App.exe'), args: [], env: {} })).rejects.toThrow('The app is not at');
    expect(spawned.calls).toEqual([]);
  });

  it('rejects when the executable cannot start', async () => {
    const child = fakeChild();
    const started = startApp({ command: process.execPath, args: [], env: {} });
    child.emit('error', new Error('spawn ENOENT'));
    await expect(started).rejects.toThrow('ENOENT');
  });
});
