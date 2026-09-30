/* @layer tooling-scripts @kind test */
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { electronTarget, serveTarget } from '@drizztdourden08/brock-thread';
import { electronAppDirs } from '../src/commands/electron-app-dirs.mjs';
import { importSpecifiers } from '../src/testing/import-specifiers.mjs';

const ROOT = resolve('/repo');

describe('electronAppDirs', () => {
  it('lists the app folder of every electron target, once each', () => {
    const workspace = {
      targets: {
        desktop: electronTarget({ app: 'apps/desktop' }),
        again: electronTarget({ app: 'apps/desktop' }),
        tools: electronTarget({ app: 'apps/tools' }),
        site: serveTarget({ command: ['vite', 'dev'] }),
      },
    };
    expect(electronAppDirs(workspace, ROOT)).toEqual([join(ROOT, 'apps/desktop'), join(ROOT, 'apps/tools')]);
  });

  it('reads a root app as the repo root', () => {
    expect(electronAppDirs({ targets: { app: electronTarget() } }, ROOT)).toEqual([ROOT]);
  });

  it('returns nothing for a workspace without targets', () => {
    expect(electronAppDirs({}, ROOT)).toEqual([]);
  });
});

describe('importSpecifiers', () => {
  it('finds static, dynamic and require imports once each', () => {
    const source = [
      'import { app } from "electron";',
      'import x from "./chunks/x.js";',
      'const y = await import("velopack");',
      'const z = require("ssh2");',
      'import "node:fs";',
      'import { app as again } from "electron";',
    ].join('\n');
    expect(importSpecifiers(source)).toEqual(['electron', './chunks/x.js', 'velopack', 'ssh2', 'node:fs']);
  });
});
