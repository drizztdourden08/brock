/* @layer electron-main @kind test */
import { basename, delimiter, dirname } from 'path';
import { describe, expect, it, vi } from 'vitest';
import { createLivePath } from '../src/main/create-live-path';
import { createTools } from '../src/main/create-tools';
import { defineTool } from '../src/main/define-tool';
import { mergePathLists } from '../src/main/merge-path-lists';
import { regPathValue } from '../src/main/reg-path-value';
import type { PathSource, ToolHooks } from '../src/main/tools-main.type';

const binary = basename(process.execPath).replace(/\.exe$/i, '');
const nodeDir = dirname(process.execPath);
const nodeVersion = process.versions.node;

const toolsOn = (pathEnv: PathSource) => createTools({
  cacheRoot: nodeDir, tempDir: nodeDir, platform: null, os: process.platform, pathEnv,
  fetch: () => Promise.reject(new Error('no network')),
  job: () => { throw new Error('no install'); },
});

const nodeTool = (hooks: ToolHooks, pathEnv: PathSource = nodeDir) => {
  const tools = toolsOn(pathEnv);
  tools.register({ id: 'runtime', label: 'Runtime', binaries: [binary], ...hooks });
  return tools;
};

describe('a tool probe', () => {
  it('runs --version on the found binary and reads the version into the state', async () => {
    const tools = nodeTool({ probe: {} });
    expect(await tools.state('runtime')).toMatchObject({ status: 'ready', source: 'path', version: nodeVersion });
  });

  it('treats a copy that fails its probe as not found', async () => {
    const tools = nodeTool({ probe: { args: ['-e', 'process.exit(3)'] } });
    expect(await tools.state('runtime')).toMatchObject({ status: 'unavailable', paths: null, version: null });
    const custom = nodeTool({ probe: () => Promise.resolve({ ok: false, error: 'too old' }) });
    expect((await custom.state('runtime'))?.status).toBe('unavailable');
  });

  it('takes a custom check or reader and probes a copy once until it changes', async () => {
    const check = vi.fn((paths: Record<string, string>) => Promise.resolve({ ok: Boolean(paths[binary]), version: '1.2' }));
    const tools = nodeTool({ probe: check });
    await tools.state('runtime');
    expect(await tools.state('runtime')).toMatchObject({ status: 'ready', version: '1.2' });
    expect(check).toHaveBeenCalledOnce();
    const read = nodeTool({ probe: { args: ['-e', 'console.log("build 7")'], read: (out) => ({ ok: out.stdout.includes('build'), version: 'custom' }) } });
    expect((await read.state('runtime'))?.version).toBe('custom');
  });

  it('refuses a probe of a binary the tool does not declare', () => {
    expect(() => defineTool({ id: 'x', label: 'X', binaries: ['a'], probe: { binary: 'b' } })).toThrow(/not one of its binaries/);
  });
});

describe('a run hook', () => {
  it('wraps every run, the probe included, and can change the call and the result', async () => {
    const seen: string[] = [];
    const tools = nodeTool({
      probe: {},
      aroundRun: async (call, next) => {
        seen.push(call.args.join(' '));
        const result = await next({ ...call, args: call.args[0] === '--version' ? call.args : ['-e', 'console.log("wrapped")'] });
        return { ...result, stdout: result.stdout.trim() };
      },
    });
    expect((await tools.run('runtime', binary, ['-e', 'nothing'])).stdout).toBe('wrapped');
    expect(seen).toEqual(['--version', '-e nothing']);
  });
});

describe('a live PATH', () => {
  it('reads the PATH on each lookup, so a tool added while the app runs is found', async () => {
    let pathEnv = '';
    const tools = toolsOn(() => pathEnv);
    tools.register({ id: 'runtime', label: 'Runtime', binaries: [binary] });
    expect((await tools.state('runtime'))?.status).toBe('unavailable');
    pathEnv = ['missing-dir', nodeDir].join(delimiter);
    expect((await tools.state('runtime'))?.status).toBe('ready');
  });

  it('reads the saved Windows PATH, expands its variables and merges it without repeats', () => {
    const out = '\r\nHKEY_CURRENT_USER\\Environment\r\n    Path    REG_EXPAND_SZ    %HOME_DIR%\\bin;C:\\Tools\r\n\r\n';
    expect(regPathValue(out, { HOME_DIR: 'C:\\Users\\me' })).toBe('C:\\Users\\me\\bin;C:\\Tools');
    expect(regPathValue('ERROR: not found', {})).toBe('');
    expect(mergePathLists(['C:\\A;c:\\tools', 'C:\\Tools;;C:\\B'], ';', true)).toBe('C:\\A;c:\\tools;C:\\B');
  });

  it('reads the PATH again only after its time to live', async () => {
    let clock = 0;
    const read = vi.fn(() => Promise.resolve(`p${clock}`));
    const live = createLivePath(read, 100, () => clock);
    expect(await live()).toBe('p0');
    clock = 50;
    expect(await live()).toBe('p0');
    clock = 150;
    expect(await live()).toBe('p150');
    expect(read).toHaveBeenCalledTimes(2);
  });
});
