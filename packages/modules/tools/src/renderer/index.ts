/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';

const toolsRenderer: RendererModule = {
  id: 'tools',
};

export default toolsRenderer;
export { toolsRenderer };
export { toolsApi } from './tools-api';
export { useTool } from './useTool';
export type { UseToolResult } from './use-tool.type';
export type { ToolState, ToolStatus, ToolsApi } from '../tools.type';
