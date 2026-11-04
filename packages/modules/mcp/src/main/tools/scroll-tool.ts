/* @layer electron-main @kind logic */
import type { MainTool } from '../mcp-main.type';
import { needWindow } from './need-window';
import { readArg } from './read-arg';

const scrollTool: MainTool = async (args, env) => {
  const contents = needWindow(env).webContents;
  const at = { x: Math.round(readArg.number(args, 'x', 0)), y: Math.round(readArg.number(args, 'y', 0)) };
  const deltaX = -readArg.number(args, 'dx', 0);
  const deltaY = -readArg.number(args, 'dy', 0);
  await env.queue.run(() => {
    contents.sendInputEvent({ type: 'mouseMove', ...at });
    contents.sendInputEvent({ type: 'mouseWheel', ...at, deltaX, deltaY, canScroll: true });
  });
  return { ok: true };
};

export { scrollTool };
