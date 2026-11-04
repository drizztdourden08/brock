/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { createMcpMain } from './mcp-main';

const mcpMain: MainModule = createMcpMain();

export default mcpMain;
export { mcpMain, createMcpMain };
export { getMcp } from './get-mcp';
export type { McpMain, McpHello } from './mcp-main.type';
