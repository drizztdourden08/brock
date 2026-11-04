/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { MainTool } from '../mcp-main.type';
import { MCP_ERROR } from '../../mcp.constants';
import { MCP_MESSAGE } from '../mcp-main.constants';
import { needWindow } from './need-window';
import { parseKeyChord } from './parse-key-chord';
import { readArg } from './read-arg';

const pressKeyTool: MainTool = async (args, env) => {
  const chord = parseKeyChord(readArg.string(args, 'chord', ''));
  if (chord === null) throw new BridgeError(MCP_MESSAGE.badKey, { code: MCP_ERROR.invalidArguments });
  const contents = needWindow(env).webContents;
  const { keyCode, modifiers, text } = chord;
  await env.queue.run(async () => {
    contents.focus();
    contents.sendInputEvent({ type: 'keyDown', keyCode, modifiers });
    if (text !== null) contents.sendInputEvent({ type: 'char', keyCode: text, modifiers });
    contents.sendInputEvent({ type: 'keyUp', keyCode, modifiers });
  });
  return { ok: true };
};

export { pressKeyTool };
