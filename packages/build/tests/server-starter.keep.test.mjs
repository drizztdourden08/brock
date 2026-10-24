/* @layer tooling-scripts @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { runPlatformPhase } from '../src/platforms/run-platform-phase.mjs';
import { cleanup, put, tempDir } from './server-fixture.mjs';

afterEach(cleanup);

const KNIP = JSON.stringify({ entry: ['brock.config.ts'], project: ['src/**/*.ts'] });

const appAt = (files = {}) => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'fixture', type: 'module' }));
  put(root, 'knip.json', KNIP);
  for (const [path, content] of Object.entries(files)) put(root, path, content);
  return root;
};

const configOf = (targets, extra = {}) => ({ product: { id: 'fixture', name: 'Fixture' }, targets, modules: [], ...extra });

const runStep = (rootDir, config) => runPlatformPhase({ rootDir, config, phase: 'files', only: ['server'] });

const read = (root, path) => readFileSync(join(root, path), 'utf8');

describe('the server starter files step', () => {
  it('writes the three server files for a windowless app, and no boot task', async () => {
    const root = appAt();
    const { lines } = await runStep(root, configOf(['server']));
    expect(lines.join('\n')).toContain('done: server/main.ts, server/data-domains.ts, server/start.ts');
    expect(read(root, 'server/main.ts')).toContain('runServer(start');
    expect(read(root, 'server/main.ts')).toContain('createDataDomains(dataDir, dataDomains)');
    expect(read(root, 'server/start.ts')).toContain('host.log(');
    expect(existsSync(join(root, 'electron/boot/server.task.ts'))).toBe(false);
  });

  it('adds the boot task that embeds the server when the app has a window', async () => {
    const root = appAt();
    await runStep(root, configOf(['desktop', 'server']));
    const task = read(root, 'electron/boot/server.task.ts');
    expect(task).toContain('embedServer(start, ctx');
    expect(task).toContain("from '../../server/start'");
    expect(task).toContain("from '../../server/data-domains'");
    expect(existsSync(join(root, 'server/main.ts'))).toBe(true);
  });

  it('lists the entry and the folder in knip.json once, however often it runs', async () => {
    const root = appAt();
    await runStep(root, configOf(['server']));
    await runStep(root, configOf(['server']));
    const knip = JSON.parse(read(root, 'knip.json'));
    expect(knip.entry).toEqual(['brock.config.ts', 'server/main.ts']);
    expect(knip.project).toEqual(['src/**/*.ts', 'server/**/*.ts']);
  });

  it('leaves an app that already has its server entry alone', async () => {
    const root = appAt({ 'server/main.ts': '// mine\n' });
    const { lines } = await runStep(root, configOf(['desktop', 'server']));
    expect(lines.join('\n')).toContain('skipped: server/main.ts exists');
    expect(read(root, 'server/main.ts')).toBe('// mine\n');
    expect(existsSync(join(root, 'server/start.ts'))).toBe(false);
    expect(existsSync(join(root, 'electron/boot/server.task.ts'))).toBe(false);
  });

  it('writes nothing when server.entry names the entry', async () => {
    const root = appAt();
    const { lines } = await runStep(root, configOf(['server'], { server: { entry: 'src/serve.ts' } }));
    expect(lines.join('\n')).toContain('skipped: server.entry is set');
    expect(existsSync(join(root, 'server'))).toBe(false);
  });
});
