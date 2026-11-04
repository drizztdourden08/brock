/* @layer mcp-helper @kind logic */
import { MCP_ERROR } from '../mcp.constants';
import type { McpToolResult } from '../mcp.type';
import { failureResult } from './failure-result';
import { HELPER_REQUEST_BUDGET_BYTES, HELPER_TEXT } from './helper.constants';
import type { McpJsonArgs } from './helper.type';

const checkRequestSize = (args: McpJsonArgs): McpToolResult | null => {
  const bytes = new TextEncoder().encode(JSON.stringify(args)).length;
  if (bytes <= HELPER_REQUEST_BUDGET_BYTES) return null;
  return failureResult(MCP_ERROR.invalidArguments, HELPER_TEXT.tooLarge(bytes, HELPER_REQUEST_BUDGET_BYTES));
};

export { checkRequestSize };
