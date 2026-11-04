/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { McpApi } from '../mcp-api.type';

const buildMcpApi = ({ invoke, send }: BridgeTools): McpApi => ({
  status: () => invoke('mcp:status'),
  setEnabled: (on) => invoke('mcp:setEnabled', on),
  toolsChanged: () => send('mcp:tools-changed'),
});

const mcpPreload: PreloadNamespace = {
  id: 'mcp',
  build: buildMcpApi,
};

export default mcpPreload;
export { mcpPreload, buildMcpApi };
export type { McpApi } from '../mcp-api.type';
