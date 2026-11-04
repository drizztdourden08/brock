/* @layer mcp-helper @kind logic */
import { MCP_ERROR } from '../mcp.constants';
import type { McpToolResult } from '../mcp.type';
import { failureResult } from './failure-result';
import { HELPER_TEXT } from './helper.constants';
import type { AppLink, HelperArgs, McpJsonArgs, TargetOptions } from './helper.type';
import { isBridgeRunning } from './is-bridge-running';
import { targetFileOf } from './target-file';

const textOf = (args: McpJsonArgs, key: string): string | null => {
  const value = args[key];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
};

const selectionOf = (args: McpJsonArgs): HelperArgs | null => {
  const selection = { userData: textOf(args, 'userData'), instance: textOf(args, 'instance'), file: textOf(args, 'file') };
  return Object.values(selection).every((value) => value === null) ? null : selection;
};

const selectApp = (link: AppLink, args: McpJsonArgs, options: TargetOptions): McpToolResult => {
  const selection = selectionOf(args);
  if (selection === null) return failureResult(MCP_ERROR.invalidArguments, HELPER_TEXT.selectNothing);
  try {
    const file = targetFileOf(selection, options);
    link.retarget(file);
    const running = isBridgeRunning(file);
    return { text: HELPER_TEXT.selected(file, running), data: { file, running }, images: [], isError: false };
  } catch (error) {
    return failureResult(MCP_ERROR.failed, error instanceof Error ? error.message : String(error));
  }
};

export { selectApp };
