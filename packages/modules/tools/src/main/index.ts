/* @layer electron-main @kind barrel */
import '../augment';
import type { MainModule } from '@drizztdourden08/brock-electron/main';
import { registerToolsHandlers } from './handlers';
import { getTools } from './tools-main';
import { DATA_DIR, MODULE_ID } from './tools-main.constants';

const toolsMain: MainModule = {
  id: MODULE_ID,
  dataDirs: [DATA_DIR],
  register: (ctx) => {
    registerToolsHandlers(ctx, getTools(ctx));
  },
};

export default toolsMain;
export { toolsMain, getTools };
export { defineTool } from './define-tool';
export { createTools } from './create-tools';
export { toolPlatform } from './tool-platform';
export { runBinary } from './run-binary';
export type {
  DownloadProgress, FetchFn, ToolRunOptions, ToolRunResult, ToolStream, ToolsEnv, ToolsMain,
} from './tools-main.type';
export type {
  ToolArchive, ToolDef, ToolDownload, ToolLocation, ToolPlatform, ToolSource, ToolState, ToolStatus, ToolsApi,
} from '../tools.type';
