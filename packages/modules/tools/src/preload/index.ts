/* @layer electron-preload @kind barrel */
import '../augment';
import type { PreloadNamespace, BridgeTools } from '@drizztdourden08/brock-electron/preload';
import type { ToolsApi } from '../tools.type';

const buildToolsApi = ({ invoke }: BridgeTools): ToolsApi => ({
  list: () => invoke('tools:list'),
  state: (id) => invoke('tools:state', id),
  install: (id) => invoke('tools:install', id),
});

const toolsPreload: PreloadNamespace = {
  id: 'tools',
  build: buildToolsApi,
};

export default toolsPreload;
export { toolsPreload, buildToolsApi };
export type { ToolsApi, ToolState } from '../tools.type';
