/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { MainTool } from '../mcp-main.type';
import { MCP_ERROR, MCP_TYPE_TEXT_MAX_CHARS } from '../../mcp.constants';
import { MCP_MESSAGE } from '../mcp-main.constants';
import { needWindow } from './need-window';
import { readArg } from './read-arg';

const typeTextTool: MainTool = async (args, env) => {
  const text = readArg.string(args, 'text', '');
  if (text.length > MCP_TYPE_TEXT_MAX_CHARS) throw new BridgeError(MCP_MESSAGE.badText, { code: MCP_ERROR.invalidArguments });
  const contents = needWindow(env).webContents;
  await env.queue.run(async () => {
    contents.focus();
    await contents.insertText(text);
  });
  return { ok: true };
};

export { typeTextTool };
