/* @layer electron-main @kind logic */
import { app, net } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { ToolsMain } from './tools-main.type';
import { DATA_DIR } from './tools-main.constants';
import { createLivePath } from './create-live-path';
import { createTools } from './create-tools';
import { systemPath } from './system-path';
import { toolPlatform } from './tool-platform';

const instances = new WeakMap<object, ToolsMain>();

const getTools = (ctx: Pick<MainContext, 'paths' | 'job'> & Partial<Pick<MainContext, 'emit'>>): ToolsMain => {
  const existing = instances.get(ctx.paths);
  if (existing) return existing;
  const created = createTools({
    cacheRoot: ctx.paths.data(DATA_DIR),
    tempDir: app.getPath('temp'),
    platform: toolPlatform(),
    os: process.platform,
    pathEnv: createLivePath(() => systemPath()),
    fetch: (url, init) => net.fetch(url, init),
    job: ctx.job,
    onChanged: (id) => ctx.emit?.('tools:changed', id),
  });
  instances.set(ctx.paths, created);
  return created;
};

export { getTools };
