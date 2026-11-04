/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { MainToolEnv } from '../mcp-main.type';
import { MCP_ERROR } from '../../mcp.constants';
import { MCP_MESSAGE } from '../mcp-main.constants';

const needWindow = ({ win }: Pick<MainToolEnv, 'win'>): BrowserWindow => {
  if (!win || win.isDestroyed() || win.webContents.isDestroyed()) {
    throw new BridgeError(MCP_MESSAGE.noWindow, { code: MCP_ERROR.noWindow });
  }
  return win;
};

export { needWindow };
