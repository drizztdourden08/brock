/* @layer tooling-scripts @kind test */
import { statSync, utimesSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { collectFindings } from '@drizztdourden08/standards/structure';
import { serverTarget } from '@drizztdourden08/brock-thread';
import { electronAppDirs } from '../src/commands/electron-app-dirs.mjs';
import { runServer } from '../src/commands/server.mjs';
import { buildStaleReason } from '../src/freshness/build-stale-reason.mjs';
import { syncApp } from '../src/modules/sync.mjs';
import { appShape, shapeOf } from '../src/platforms/server/app-shape.mjs';
import brockApp from '../standards.extension.mjs';
import { cleanup, fixtureApp, put, tempDir } from './server-fixture.mjs';

afterEach(cleanup);

describe('a windowless app', () => {
  const syncedFiles = (targets) => {
    const root = tempDir();
    put(root, 'package.json', JSON.stringify({ name: 'fixture', type: 'module' }));
    put(root, 'brock.config.ts', '');
    return syncApp(root, { product: { id: 'fixture', name: 'Fixture' }, targets, modules: [] }, { check: true, onMissing: 'skip' }).drifted;
  };

  it('gets none of the Electron or renderer managed files', () => {
    const server = syncedFiles(['server']);
    expect(server).toContain('tsconfig.json');
    expect(server).toContain('.brock/manifest.json');
    for (const absent of ['electron.vite.config.ts', 'electron-builder.config.cjs', '.brock/modules.main.ts', '.brock/boot.main.ts', '.brock/boot.renderer.ts', '.brock/screens.ts', '.brock/widgets.ts', '.brock/title-bar.ts', '.brock/tours.ts', '.brock/toolbars.ts', '.brock/startup.ts', '.brock/review.ts', '.brock/palette.css']) {
      expect(server).not.toContain(absent);
    }
  });

  it('keeps every file when the desktop ships beside the server', () => {
    const both = syncedFiles(['desktop', 'server']);
    expect(both).toEqual(expect.arrayContaining(['electron.vite.config.ts', 'electron-builder.config.cjs', '.brock/boot.main.ts', '.brock/tours.ts', 'tsconfig.json']));
  });

  it('is told apart from a desktop app by its targets', () => {
    expect(shapeOf(['server'])).toEqual({ server: true, windowless: true });
    expect(shapeOf(['desktop', 'server'])).toEqual({ server: true, windowless: false });
    expect(shapeOf(['desktop'])).toEqual({ server: false, windowless: false });
    expect(shapeOf([])).toEqual({ server: false, windowless: false });
    const root = fixtureApp({}, {});
    put(root, 'brock.config.ts', "export default { product: { id: 'a', name: 'A' }, targets: ['server'], modules: [] };\n");
    expect(appShape(root)).toEqual({ server: true, windowless: true });
    put(root, 'brock.config.ts', "export default { product: { id: 'a', name: 'A' }, modules: [] };\n");
    expect(appShape(root)).toEqual({ server: false, windowless: false });
  });

  it('gets no installer or screen checks from the standard', async () => {
    const files = { 'package.json': '{ "name": "app" }', 'build/installer/notes.txt': 'x' };
    const windowless = tempDir();
    for (const [file, text] of Object.entries({ ...files, 'brock.config.ts': "export default { targets: ['server'] };\n" })) put(windowless, file, text);
    expect((await collectFindings(windowless, '@app', [brockApp])).findings).toEqual([]);
    const desktop = tempDir();
    for (const [file, text] of Object.entries({ ...files, 'brock.config.ts': '' })) put(desktop, file, text);
    expect((await collectFindings(desktop, '@app', [brockApp])).findings).toHaveLength(1);
  });
});

describe('the build freshness of a server app', () => {
  const age = (path, secondsAgo) => {
    const at = new Date(Date.now() - secondsAgo * 1000);
    utimesSync(path, at, at);
  };

  const built = (targets, outputs) => {
    const root = tempDir();
    put(root, 'package.json', '{ "name": "app" }');
    put(root, 'brock.config.ts', `export default { targets: [${targets.map((target) => `'${target}'`).join(', ')}] };\n`);
    put(root, 'server/main.ts', 'x');
    put(root, 'src/main.tsx', 'x');
    for (const file of ['package.json', 'brock.config.ts', 'server/main.ts', 'src/main.tsx']) age(join(root, file), 600);
    outputs.forEach((file, i) => {
      put(root, file, file);
      age(join(root, file), 60 - i * 5);
    });
    return root;
  };

  const DESKTOP = ['dist/electron/main.js', 'dist/preload/preload.mjs', 'dist/renderer/index.html'];

  it('asks only for dist/server/main.mjs from a windowless app, and notices a changed server source', () => {
    expect(buildStaleReason(tempDir())).toMatch(/dist\/electron\/main\.js is missing/);
    const root = built(['server'], ['dist/server/main.mjs']);
    expect(buildStaleReason(root)).toBeNull();
    put(root, 'server/handler.ts', 'changed');
    expect(statSync(join(root, 'server/handler.ts')).mtimeMs).toBeGreaterThan(statSync(join(root, 'dist/server/main.mjs')).mtimeMs);
    expect(buildStaleReason(root)).toBe('server changed since the last build');
    const missing = built(['server'], []);
    expect(buildStaleReason(missing)).toBe('dist/server/main.mjs is missing');
  });

  it('asks for the server output beside the desktop outputs when both ship', () => {
    const desktopOnly = built(['desktop', 'server'], DESKTOP);
    expect(buildStaleReason(desktopOnly)).toBe('dist/server/main.mjs is missing');
    expect(buildStaleReason(built(['desktop', 'server'], [...DESKTOP, 'dist/server/main.mjs']))).toBeNull();
    expect(buildStaleReason(built(['desktop'], DESKTOP))).toBeNull();
  });
});

describe('the server command', () => {
  it('prints its usage for an unknown mode and refuses an app that does not target the server', async () => {
    const root = fixtureApp({ targets: ['desktop'] }, {});
    expect(await runServer({ rootDir: root, args: ['package'] })).toBe(1);
    expect(await runServer({ rootDir: root, args: ['build'] })).toBe(1);
  });

  it('lists the app folder of a server launch target with the electron ones', () => {
    const root = resolve('/repo');
    expect(electronAppDirs({ targets: { server: serverTarget({ app: 'apps/server' }) } }, root)).toEqual([join(root, 'apps/server')]);
  });
});
