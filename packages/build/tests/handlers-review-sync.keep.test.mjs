/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderHandlersFiles } from '../src/handlers/render-handlers.mjs';
import { renderReviewFiles } from '../src/review/render-review.mjs';
import { nodeBarrelNotes } from '../src/renderer-imports/node-barrel-notes.mjs';
import { SYNC_INPUTS } from '../src/freshness/freshness.constants.mjs';

const dirs = [];

const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-sync-'));
  dirs.push(dir);
  return dir;
};

const put = (root, path, content = '') => {
  mkdirSync(join(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), content);
};

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('brock sync: handlers and review', () => {
  it('lists electron/handlers/<subject>-handlers.ts in .brock/handlers.main.ts, by their export names', () => {
    const root = tempDir();
    put(root, 'electron/handlers/session-log-handlers.ts');
    put(root, 'electron/handlers/engine-handlers.ts');
    put(root, 'electron/handlers/index.ts');
    put(root, 'electron/handlers/helpers.ts');
    const [file] = renderHandlersFiles(root);
    expect(file.path).toBe('.brock/handlers.main.ts');
    expect(file.content).toContain("import { engineHandlers } from '../electron/handlers/engine-handlers';");
    expect(file.content).toContain("import { sessionLogHandlers } from '../electron/handlers/session-log-handlers';");
    expect(file.content).toContain('const mainHandlers: HandlerGroup[] = [engineHandlers, sessionLogHandlers];');
    expect(renderHandlersFiles(tempDir())[0].content).toContain('const mainHandlers: HandlerGroup[] = [];');
  });

  it('writes .brock/review.ts with lazy imports of the seed and the steps', () => {
    const root = tempDir();
    put(root, 'src/review/seed.ts');
    put(root, 'src/review/sessions.step.ts');
    put(root, 'src/review/dashboard.step.ts');
    const [file] = renderReviewFiles(root);
    expect(file.path).toBe('.brock/review.ts');
    expect(file.content).toContain("seed: () => import('../src/review/seed'),");
    expect(file.content.indexOf("id: 'dashboard'")).toBeLessThan(file.content.indexOf("id: 'sessions'"));
    expect(file.content).toContain("{ id: 'sessions', load: () => import('../src/review/sessions.step') },");
    const empty = renderReviewFiles(tempDir())[0].content;
    expect(empty).toContain('seed: null,');
    expect(empty).toContain('steps: [],');
    put(root, 'src/review/Bad_Name.step.ts');
    expect(() => renderReviewFiles(root)).toThrow(/kebab-case/);
  });

  it('treats a change in either folder as a reason to sync again', () => {
    expect(SYNC_INPUTS).toEqual(expect.arrayContaining(['electron/handlers', 'src/review']));
  });
});

describe('brock structure: renderer imports of a Node barrel', () => {
  it('warns when a renderer file imports a workspace barrel that reaches Node, and names a subpath', () => {
    const root = tempDir();
    const pkg = join(root, 'packages', 'hosts');
    put(pkg, 'package.json', JSON.stringify({ name: '@x/hosts', exports: { '.': './src/index.ts', './web': './src/web/index.ts' } }));
    put(pkg, 'src/index.ts', "export { webHost } from './web';\nexport { localHost } from './local/local-host';\n");
    put(pkg, 'src/web/index.ts', 'export const webHost = 1;\n');
    put(pkg, 'src/local/local-host.ts', "import type { Server } from 'node:net';\nimport { spawn } from 'node:child_process';\nexport const localHost = spawn;\nexport type { Server };\n");
    const app = join(root, 'app');
    mkdirSync(join(app, 'node_modules', '@x'), { recursive: true });
    symlinkSync(pkg, join(app, 'node_modules', '@x', 'hosts'), 'junction');
    put(app, 'src/views/Hosts.tsx', "import { webHost } from '@x/hosts';\nexport { webHost };\n");
    put(app, 'src/views/Typed.ts', "import type { webHost } from '@x/hosts';\nexport type { webHost };\n");
    put(app, 'src/views/Sub.ts', "import { webHost } from '@x/hosts/web';\nexport { webHost };\n");
    const notes = nodeBarrelNotes(app, 'apps/app/');
    expect(notes).toHaveLength(1);
    expect(notes[0]).toContain('apps/app/src/views/Hosts.tsx imports the @x/hosts barrel');
    expect(notes[0]).toContain('node:child_process in src/local/local-host.ts');
    expect(notes[0]).toContain('@x/hosts/web');
  });
});
