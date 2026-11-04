/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { MainTool } from '../mcp-main.type';
import { windowScale } from './window-scale';

const appInfoTool: MainTool = (_args, { ctx, win }) => {
  const open = win !== null && !win.isDestroyed();
  const [width = 0, height = 0] = open ? win.getContentSize() : [];
  return Promise.resolve({
    data: {
      id: ctx.product.id,
      name: ctx.product.name,
      version: app.getVersion(),
      isDev: ctx.isDev,
      window: { width, height, visible: open && win.isVisible(), scale: open ? windowScale(win) : 1 },
    },
  });
};

export { appInfoTool };
