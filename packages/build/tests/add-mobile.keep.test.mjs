/* @layer tooling-scripts @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { installSpecs, runPlatformAdd } = vi.hoisted(() => ({ installSpecs: vi.fn(), runPlatformAdd: vi.fn() }));

vi.mock('../src/modules/install-specs.mjs', () => ({ installSpecs }));
vi.mock('../src/modules/install-peers.mjs', () => ({ installPeers: vi.fn(async () => 0) }));
vi.mock('../src/modules/resolve.mjs', () => ({ resolveModules: vi.fn(() => ({ missing: [] })) }));
vi.mock('../src/commands/sync.mjs', () => ({ runSync: vi.fn(async () => 0) }));
vi.mock('../src/commands/platform-add.mjs', () => ({ runPlatformAdd }));
vi.mock('node:fs', async (original) => {
  const fs = await original();
  const readConfigOnly = (path, ...rest) => (String(path).endsWith('brock.config.ts') ? "modules: ['updater']" : fs.readFileSync(path, ...rest));
  return { ...fs, readFileSync: vi.fn(readConfigOnly), writeFileSync: vi.fn() };
});

const { runAdd } = await import('../src/commands/add.mjs');

beforeEach(() => {
  installSpecs.mockReset().mockResolvedValue(0);
  runPlatformAdd.mockReset().mockResolvedValue(0);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

describe('K4 brock add mobile is the android platform', { tags: ['critical'] }, () => {
  it('runs platform add and never installs a package', async () => {
    expect(await runAdd({ rootDir: 'app', input: 'mobile' })).toBe(0);
    expect(runPlatformAdd).toHaveBeenCalledWith('app', ['mobile']);
    expect(installSpecs).not.toHaveBeenCalled();
  });

  it('keeps sending a module input to the installer', async () => {
    await runAdd({ rootDir: 'app', input: 'port-kit' });
    expect(installSpecs).toHaveBeenCalled();
    expect(runPlatformAdd).not.toHaveBeenCalled();
  });
});
