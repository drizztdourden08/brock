/* @layer electron-main @kind test */
import { EventEmitter } from 'node:events';
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
    const started = startApp({ command: '/apps/Bxel', args: ['--background'], env: { EXTRA: '1' } });
    child.emit('spawn');
    await expect(started).resolves.toBe(4321);
    const [command, args, options] = spawned.calls[0] as [string, string[], { env: Record<string, string>; detached: boolean; stdio: string }];
    expect([command, args, options.detached, options.stdio]).toEqual(['/apps/Bxel', ['--background'], true, 'ignore']);
    expect(options.env).not.toHaveProperty('ELECTRON_RUN_AS_NODE');
    expect(options.env).toMatchObject({ KEEP_ME: 'yes', EXTRA: '1' });
    expect(child.unref).toHaveBeenCalledOnce();
  });

  it('rejects when the executable cannot start', async () => {
    const child = fakeChild();
    const started = startApp({ command: '/missing', args: [], env: {} });
    child.emit('error', new Error('spawn /missing ENOENT'));
    await expect(started).rejects.toThrow('ENOENT');
  });
});
