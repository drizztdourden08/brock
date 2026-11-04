/* @layer electron-main @kind constants */
import { MCP_ERROR } from '../mcp.constants';

const CODED_ERRORS: readonly string[] = [MCP_ERROR.unknownTool, MCP_ERROR.invalidArguments, MCP_ERROR.timeout, MCP_ERROR.failed];

export { CODED_ERRORS };
