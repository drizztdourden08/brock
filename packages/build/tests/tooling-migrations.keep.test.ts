/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectMigrations, runMigrations, selectMigrations } from '../src/upgrade/index.mjs';

const dirs: string[] = [];

const only = (id: string) => selectMigrations(collectMigrations([]), { from: '0.16.0', to: null }).filter((m) => m.file.endsWith(`${id}.mjs`));

const appWith = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'brock-migrate-'));
  dirs.push(root);
  for (const [path, content] of Object.entries({ 'package.json': '{"name":"x"}', ...files })) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
};

const read = (root: string, path: string) => readFileSync(join(root, path), 'utf8');

const twice = async (root: string, id: string) => {
  const first = await runMigrations(root, only(id));
  const snapshot = read(root, id === 'review-files' ? 'src/main.tsx' : 'electron/main.ts');
  const second = await runMigrations(root, only(id));
  return { first, second, snapshot };
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const MAIN_TSX = "import { BrockApp } from '@drizztdourden08/brock-react';\nimport { appWidgets } from '../.brock/widgets';\n\nroot.render(\n  <BrockApp\n    product={product}\n    widgets={appWidgets}\n  />,\n);\n";

const INDEX = "import type { HandlerGroup } from '@drizztdourden08/brock-electron/main';\nimport { dataHandlers } from './data-handlers';\nimport { engineHandlers } from './engine-handlers';\n\nconst handlers: HandlerGroup[] = [dataHandlers, engineHandlers];\n\nexport { handlers };\n";

const ELECTRON_MAIN = "import { bootstrapApp } from '@drizztdourden08/brock-electron/main';\nimport { mainBootTasks } from '../.brock/boot.main';\nimport { handlers } from './handlers';\n\nbootstrapApp(product, {\n  bootTasks: mainBootTasks,\n  handlers,\n});\n";

describe('0.17.0 migrations', () => {
  it('review-files wires review={appReview} once', async () => {
    const root = appWith({ 'src/main.tsx': MAIN_TSX });
    const { second, snapshot } = await twice(root, 'review-files');
    expect(snapshot).toContain("import { appReview } from '../.brock/review';");
    expect(snapshot).toContain('    widgets={appWidgets}\n    review={appReview}\n');
    expect(read(root, 'src/main.tsx')).toBe(snapshot);
    expect(second.applied[0]?.touched).toEqual([]);
  });

  it('handlers-by-file drops a hand list that matches the files, and removes the index', async () => {
    const root = appWith({ 'electron/main.ts': ELECTRON_MAIN, 'electron/handlers/index.ts': INDEX, 'electron/handlers/data-handlers.ts': '', 'electron/handlers/engine-handlers.ts': '' });
    const { first, snapshot } = await twice(root, 'handlers-by-file');
    expect(snapshot).toContain("import { mainHandlers } from '../.brock/handlers.main';");
    expect(snapshot).toContain('  handlers: mainHandlers,\n');
    expect(snapshot).not.toContain("from './handlers'");
    expect(existsSync(join(root, 'electron/handlers/index.ts'))).toBe(false);
    expect(first.applied[0]?.touched).toEqual(['electron/main.ts', 'electron/handlers/index.ts (removed)']);
    expect(read(root, 'electron/main.ts')).toBe(snapshot);
  });

  it('handlers-by-file leaves a list that differs from the files as a to-do', async () => {
    const root = appWith({ 'electron/main.ts': ELECTRON_MAIN, 'electron/handlers/index.ts': INDEX, 'electron/handlers/data-handlers.ts': '', 'electron/handlers/engine-handlers.ts': '', 'electron/handlers/extra-handlers.ts': '' });
    const run = await runMigrations(root, only('handlers-by-file'));
    expect(read(root, 'electron/main.ts')).toBe(ELECTRON_MAIN);
    expect(run.todos).toHaveLength(1);
    expect(run.todos[0]?.message).toContain('[dataHandlers, engineHandlers, extraHandlers]');
  });

  it('handlers-by-file adds the generated list where main passes none and has no handler files', async () => {
    const root = appWith({ 'electron/main.ts': "import { mainBootTasks } from '../.brock/boot.main';\n\nbootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks });\n" });
    const { snapshot } = await twice(root, 'handlers-by-file');
    expect(snapshot).toContain('bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks, handlers: mainHandlers });');
    expect(snapshot.match(/handlers\.main/g)).toHaveLength(1);
  });

  it('channel-declarations lists the channels that can move, once per file', async () => {
    const constants = "const APP_INVOKE_MAP = {\n  engineStatus: 'ap:engine:status',\n} as const satisfies Record<string, keyof InvokeContract>;\nconst APP_EVENT_MAP = { onSessionEvent: 'ap:sessions:event' } as const satisfies Record<string, keyof EventContract>;\n";
    const root = appWith({ 'src/ipc/contract.constants.ts': constants, 'src/ipc/new.ts': "const APP_CHANNELS = defineChannels({ a: invoke<() => Promise<void>>()('a:b') });\n" });
    const run = await runMigrations(root, only('channel-declarations'));
    expect(run.todos).toHaveLength(1);
    expect(run.todos[0]?.message).toContain("engineStatus (invoke 'ap:engine:status'), onSessionEvent (event 'ap:sessions:event')");
    expect(read(root, 'src/ipc/contract.constants.ts')).toBe(constants);
  });

  it('app-services points a MainContext WeakMap memo at ctx.services', async () => {
    const root = appWith({ 'electron/services/services-of.ts': 'const built = new WeakMap<MainContext, AppServices>();\n' });
    const run = await runMigrations(root, only('app-services'));
    expect(run.todos.map((t) => t.message)).toEqual([expect.stringContaining('ctx.services')]);
  });

  it('brock-dir-tracked keeps .brock out of the dot-folder rule, once', async () => {
    const root = appWith({ '.gitignore': '.*/\n!.github/\n\nnode_modules/\n' });
    await runMigrations(root, only('brock-dir-tracked'));
    await runMigrations(root, only('brock-dir-tracked'));
    expect(read(root, '.gitignore')).toBe('.*/\n!.github/\n!.brock/\n.brock/profile-config.json\n\nnode_modules/\n');
  });

  it('mark-svg-ignored ignores the generated mark beside the other logos, once', async () => {
    const root = appWith({ '.gitignore': 'dist/\n**/public/logos/icon-256.png\n**/public/logos/icon-bot-256.png\nout/\n' });
    await runMigrations(root, only('mark-svg-ignored'));
    await runMigrations(root, only('mark-svg-ignored'));
    expect(read(root, '.gitignore')).toBe('dist/\n**/public/logos/icon-256.png\n**/public/logos/icon-bot-256.png\n**/public/logos/mark.svg\nout/\n');
  });
});
