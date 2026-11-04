/* @layer renderer-shell @kind logic */
import { answer } from '@drizztdourden08/brock-react';
import { MCP_RENDERER_CHANNEL } from '../mcp.constants';
import { callRendererTool } from './call-renderer-tool';
import { mcpApi } from './mcp-api';
import { rendererRegistry } from './renderer-registry';

const installAnswers = (): (() => void) => {
  const offs = [
    answer(MCP_RENDERER_CHANNEL.list, () => rendererRegistry.list()),
    answer(MCP_RENDERER_CHANNEL.call, (name, args) => callRendererTool(name, args)),
    rendererRegistry.onChange(() => mcpApi()?.toolsChanged()),
  ];
  return () => {
    for (const off of offs) off();
  };
};

export { installAnswers };
