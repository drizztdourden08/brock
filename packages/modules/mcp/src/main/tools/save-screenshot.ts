/* @layer electron-main @kind logic */
import { writeAtomic } from '@drizztdourden08/brock-electron/main';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { MCP_SCREENSHOTS_DIR } from '../../mcp.constants';
import { SCREENSHOT_EXTENSION } from './screenshot.constants';

const saveScreenshot = async (ctx: MainContext, name: string, png: Buffer): Promise<string> => {
  const file = ctx.paths.data(...MCP_SCREENSHOTS_DIR.split('/'), `${name}${SCREENSHOT_EXTENSION}`);
  await writeAtomic(file, png);
  return file;
};

export { saveScreenshot };
