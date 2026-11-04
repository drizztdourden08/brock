/* @layer electron-main @kind constants */
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { MCP_HELPER_TOOL_NAMES } from './mcp-main.constants';

const RESERVED_TOOL_NAMES = [...BUILT_IN_TOOLS.map((spec) => spec.name), ...MCP_HELPER_TOOL_NAMES];

export { RESERVED_TOOL_NAMES };
