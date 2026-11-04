/* @layer electron-main @kind logic */
import type { MainTool } from '../mcp-main.type';
import { CLICK_BUTTONS } from './click-tool.constants';
import { needWindow } from './need-window';
import { readArg } from './read-arg';

const clickTool: MainTool = async (args, env) => {
  const contents = needWindow(env).webContents;
  const at = { x: Math.round(readArg.number(args, 'x', 0)), y: Math.round(readArg.number(args, 'y', 0)) };
  const wanted = readArg.string(args, 'button', 'left');
  const button = CLICK_BUTTONS.find((each) => each === wanted) ?? 'left';
  const count = readArg.number(args, 'count', 1);
  await env.queue.run(() => {
    contents.focus();
    contents.sendInputEvent({ type: 'mouseMove', ...at });
    for (let clickCount = 1; clickCount <= count; clickCount += 1) {
      contents.sendInputEvent({ type: 'mouseDown', ...at, button, clickCount });
      contents.sendInputEvent({ type: 'mouseUp', ...at, button, clickCount });
    }
  });
  return { ok: true };
};

export { clickTool };
