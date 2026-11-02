/* @layer electron-main @kind test */
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import * as serverEntry from '../src/server';
import { resolveDataDir } from '../src/server/data-dir';
import { runServer } from '../src/server/run-server';
import { createHarness, removeHarnessRoots } from './server-harness';

const LINE = /^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\] \[(log|info|warn|error)\] (.+)\n$/;

afterEach(removeHarnessRoots);

describe('K2 the data folder', { tags: ['critical'] }, () => {
  it('takes the flag first, then BROCK_DATA_DIR, then STATE_DIRECTORY, then ./.user-data', () => {
    const cwd = resolve('/work');
    expect(resolveDataDir(['--user-data=flag'], { BROCK_DATA_DIR: 'env', STATE_DIRECTORY: '/state' }, cwd)).toBe(resolve(cwd, 'flag'));
    expect(resolveDataDir([], { BROCK_DATA_DIR: 'env', STATE_DIRECTORY: '/state' }, cwd)).toBe(resolve(cwd, 'env'));
    expect(resolveDataDir([], { STATE_DIRECTORY: '/var/lib/app:/var/lib/other' }, cwd)).toBe(resolve(cwd, '/var/lib/app'));
    expect(resolveDataDir([], {}, cwd)).toBe(resolve(cwd, '.user-data'));
  });

  it('is exported from the server entry, and runServer hands its answer to start', async () => {
    expect(serverEntry.resolveDataDir).toBe(resolveDataDir);
    const { options, root } = await createHarness();
    const env = { BROCK_DATA_DIR: join(root, 'from-env') };
    const seen: string[] = [];
    await runServer((host) => {
      seen.push(host.dataDir);
      return { stop: () => undefined };
    }, { ...options, argv: [], env });
    expect(seen).toEqual([serverEntry.resolveDataDir([], env, root)]);
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

describe('K2 the stdout log', { tags: ['critical'] }, () => {
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
