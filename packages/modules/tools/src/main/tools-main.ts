/* @layer electron-main @kind logic */
import { app, net } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { ToolsMain } from './tools-main.type';
import { DATA_DIR } from './tools-main.constants';
import { createTools } from './create-tools';
import { toolPlatform } from './tool-platform';

const instances = new WeakMap<object, ToolsMain>();

const getTools = (ctx: Pick<MainContext, 'paths' | 'job'>): ToolsMain => {
  const existing = instances.get(ctx.paths);
  if (existing) return existing;
  const created = createTools({
    cacheRoot: ctx.paths.data(DATA_DIR),
    tempDir: app.getPath('temp'),
    platform: toolPlatform(),
    os: process.platform,
    pathEnv: process.env.PATH ?? '',
    fetch: (url, init) => net.fetch(url, init),
    job: ctx.job,
  });
  instances.set(ctx.paths, created);
  return created;
};

export { getTools };
