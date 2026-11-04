/* @layer electron-main @kind logic */
import { captureFrame, waitCaptureHolds, BridgeError } from '@drizztdourden08/brock-electron/main';
import type { MainTool } from '../mcp-main.type';
import { MCP_ERROR, MCP_SCREENSHOT_NAME_REGEX, MCP_TIMEOUT_MS } from '../../mcp.constants';
import { MCP_MESSAGE } from '../mcp-main.constants';
import { downscaleImage } from './downscale-image';
import { needWindow } from './need-window';
import { readArg } from './read-arg';
import { saveScreenshot } from './save-screenshot';
import { SCREENSHOT_DEFAULT_WIDTH, SCREENSHOT_MIME, SCREENSHOT_SCALE_DIGITS } from './screenshot.constants';

const nameOf = (value: string): string | null => {
  if (value === '') return null;
  if (!MCP_SCREENSHOT_NAME_REGEX.test(value)) throw new BridgeError(MCP_MESSAGE.badName, { code: MCP_ERROR.invalidArguments });
  return value;
};

const screenshotTool: MainTool = async (args, env) => {
  const name = nameOf(readArg.string(args, 'name', ''));
  const win = needWindow(env);
  if (readArg.boolean(args, 'settle', true)) await waitCaptureHolds(MCP_TIMEOUT_MS.captureHolds);
  const frame = await captureFrame(win.webContents);
  const image = downscaleImage(frame, readArg.number(args, 'maxWidth', SCREENSHOT_DEFAULT_WIDTH));
  if (image.width === 0) throw new BridgeError(MCP_MESSAGE.badFrame, { code: MCP_ERROR.failed });
  const path = name === null ? null : await saveScreenshot(env.ctx, name, image.png);
  const [contentWidth = 0] = win.getContentSize();
  const cssWidth = contentWidth === 0 ? image.width : contentWidth;
  const scale = Math.round((image.width / cssWidth) * SCREENSHOT_SCALE_DIGITS) / SCREENSHOT_SCALE_DIGITS;
  return {
    text: `Screenshot ${image.width}x${image.height}${path === null ? '' : `, saved to ${path}`}`,
    data: { width: image.width, height: image.height, scale, path },
    images: [{ data: image.png.toString('base64'), mimeType: SCREENSHOT_MIME }],
  };
};

export { screenshotTool };
