/* @layer electron-main @kind logic */
import { BridgeError } from '@drizztdourden08/brock-electron/main';
import type { McpToolResult } from '../mcp.type';
import { CODED_ERRORS } from './renderer-result-error.constants';

const rendererResultError = (result: McpToolResult): BridgeError | null => {
  const code = result.data?.code;
  if (!result.isError || typeof code !== 'string' || !CODED_ERRORS.includes(code)) return null;
  return new BridgeError(result.text, { code });
};

export { rendererResultError };
