/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { answerBootTask } from './answer-boot-task';

const mcpRenderer: RendererModule = {
  id: 'mcp',
  bootTasks: [answerBootTask],
};

export default mcpRenderer;
export { mcpRenderer };
export { mcpTools } from './mcp-tools';
export { useMcpTools } from './useMcpTools';
export { mcpApi } from './mcp-api';
export type { McpToolDef, McpToolResult, McpToolInfo, McpArgs, McpCallContext, McpStatus } from '../mcp.type';
