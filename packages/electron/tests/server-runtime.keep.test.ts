/* @layer electron-main @kind test */
import { existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveDataDir } from '../src/server/data-dir';
import { runServer } from '../src/server/run-server';
import { createHarness, removeHarnessRoots } from './server-harness';

const ENTRY = resolve(import.meta.dirname, '../src/server/index.ts');
const SPECIFIER = /from\s+'([^']+)'/g;
const LINE = /^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\] \[(log|info|warn|error)\] (.+)\n$/;

const sourceOf = (from: string, spec: string): string => {
  const target = resolve(dirname(from), spec);
  return [`${target}.ts`, join(target, 'index.ts')].find((candidate) => existsSync(candidate)) ?? target;
};

const externalSpecs = (entry: string): string[] => {
  const queue = [entry];
  const visited = new Set<string>();
  const external: string[] = [];
  for (let file = queue.pop(); file !== undefined; file = queue.pop()) {
    if (visited.has(file)) continue;
    visited.add(file);
    const specs = [...readFileSync(file, 'utf8').matchAll(SPECIFIER)].map((match) => match[1] ?? '');
    for (const spec of specs) {
      if (spec.startsWith('.')) queue.push(sourceOf(file, spec));
      else external.push(spec);
    }
  }
  return external;
};

afterEach(removeHarnessRoots);

describe('the Electron-free entry, @drizztdourden08/brock-electron/server', () => {
  it('reaches no module of Electron, so plain Node can load it', () => {
    const external = externalSpecs(ENTRY);
    const electronic = external.filter((spec) => /^(electron(\/|$)|@electron-toolkit)/.test(spec));
    expect(external).toContain('fs');
    expect(electronic).toEqual([]);
  });
});

describe('the data folder', () => {
  it('takes the flag first, then BROCK_DATA_DIR, then STATE_DIRECTORY, then ./.user-data', () => {
    const cwd = resolve('/work');
    expect(resolveDataDir(['--user-data=flag'], { BROCK_DATA_DIR: 'env', STATE_DIRECTORY: '/state' }, cwd)).toBe(resolve(cwd, 'flag'));
    expect(resolveDataDir([], { BROCK_DATA_DIR: 'env', STATE_DIRECTORY: '/state' }, cwd)).toBe(resolve(cwd, 'env'));
    expect(resolveDataDir([], { STATE_DIRECTORY: '/var/lib/app:/var/lib/other' }, cwd)).toBe(resolve(cwd, '/var/lib/app'));
    expect(resolveDataDir([], {}, cwd)).toBe(resolve(cwd, '.user-data'));
  });

  it('skips an empty value and keeps going down the order', () => {
    const cwd = resolve('/work');
    expect(resolveDataDir(['--user-data='], { BROCK_DATA_DIR: '', STATE_DIRECTORY: '' }, cwd)).toBe(resolve(cwd, '.user-data'));
  });

  it('creates the folder before start runs and hands it to the host', async () => {
    const { options, dataDir } = await createHarness();
    const seen: string[] = [];
    await runServer((host) => {
      seen.push(host.dataDir);
      expect(existsSync(host.dataDir)).toBe(true);
      return { stop: () => undefined };
    }, options);
    expect(seen).toEqual([dataDir]);
  });

  it('builds the domains from the data folder with the factory the app passes', async () => {
    const { options, dataDir } = await createHarness();
    const received: unknown[] = [];
    await runServer<{ dir: string }>((host) => {
      received.push(host.domains);
      return { stop: () => undefined };
    }, { ...options, domains: (dir) => ({ dir }) });
    expect(received).toEqual([{ dir: dataDir }]);
  });
});

describe('the stdout log', () => {
  it('writes one main-format line per event and sends errors to stderr', async () => {
    const { options, out, err } = await createHarness();
    await runServer((host) => {
      host.log('ready for work');
      host.log('careful', 'warn');
      host.log('broken', 'error');
      return { stop: () => undefined };
    }, options);
    const lines = out.map((line) => LINE.exec(line));
    expect(lines.every((match) => match !== null)).toBe(true);
    expect(lines.map((match) => `${match?.[1]} ${match?.[2]}`)).toEqual(
      expect.arrayContaining(['info ready for work', 'warn careful']),
    );
    expect(err).toHaveLength(1);
    expect(LINE.exec(err[0] ?? '')?.slice(1)).toEqual(['error', 'broken']);
    expect(out.join('')).not.toContain('broken');
  });
});
