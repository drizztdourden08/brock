/* @layer core @kind logic */
import { MCP_TOOL_NAME_REGEX } from './mcp.constants';

const assertToolName = (name: string): void => {
  if (!MCP_TOOL_NAME_REGEX.test(name)) {
    throw new Error(`mcp tool name "${name}" must match ${MCP_TOOL_NAME_REGEX.source}`);
  }
};

export { assertToolName };
