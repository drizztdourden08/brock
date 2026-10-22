/* @layer core @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

const claim = vi.fn();
const release = vi.fn();
const sourceStart = vi.fn();

vi.mock('../src/main/pad-lock', () => ({ createPadLock: () => ({ claim, release }) }));
vi.mock('../src/main/create-input-runtime', () => ({
  createInputRuntime: () => ({
    status: () => ({ available: true, sdlVersion: '3.x' }),
    source: { start: sourceStart, stop: vi.fn() },
    haptics: { cancelAll: vi.fn() },
    mappings: { load: () => Promise.resolve() },
  }),
}));

const { getInput } = await import('../src/main/input-main');

const contextFor = (argv: string[]) => {
  const log = vi.fn();
  const has = (flag: string) => argv.some((a) => a === flag || a.startsWith(`${flag}=`));
  const ctx = {
    product: { name: 'Probe' } as MainContext['product'],
    log,
    files: {} as MainContext['files'],
    flags: { isHeadlessLaunch: () => has('--no-focus') && !has('--visible'), hasFlag: has } as MainContext['flags'],
  } as Partial<MainContext> as MainContext;
  return { ctx, log };
};

describe('starting SDL3 on a headless launch', () => {
  beforeEach(() => { vi.clearAllMocks(); claim.mockReturnValue({ ok: true }); });

  it('stays off by default', async () => {
    const { ctx } = contextFor(['--no-focus']);
    await getInput(ctx).start();
    expect(sourceStart).not.toHaveBeenCalled();
    expect(claim).not.toHaveBeenCalled();
  });

  it('starts with --input-live and claims the pad without taking over', async () => {
    const { ctx } = contextFor(['--no-focus', '--input-live']);
    await getInput(ctx).start();
    expect(claim).toHaveBeenCalledWith(false);
    expect(sourceStart).toHaveBeenCalledTimes(1);
  });

  it('refuses with one warning when another instance holds the pad', async () => {
    claim.mockReturnValue({ ok: false, holder: { pid: 7, product: 'Owner', since: 'then' } });
    const { ctx, log } = contextFor(['--no-focus', '--input-live']);
    const input = getInput(ctx);
    await input.start();
    await input.start();
    expect(sourceStart).not.toHaveBeenCalled();
    const warnings = log.mock.calls.filter(([, level]) => level === 'warn');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.[0]).toContain('pid 7');
  });

  it('lets a normal launch take the pad and releases it on stop', async () => {
    const { ctx } = contextFor([]);
    const input = getInput(ctx);
    await input.start();
    expect(claim).toHaveBeenCalledWith(true);
    input.stop();
    expect(release).toHaveBeenCalled();
  });

  it('ignores --input-live on a visible launch', async () => {
    const { ctx } = contextFor(['--no-focus', '--visible', '--input-live']);
    await getInput(ctx).start();
    expect(claim).toHaveBeenCalledWith(true);
  });
});
