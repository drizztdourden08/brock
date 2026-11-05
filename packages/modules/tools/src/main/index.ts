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
export { systemPath } from './system-path';
export { withSentTagging } from './recording/with-sent-tagging';
export { markRecordingsSent } from './recording/mark-recordings-sent';
export { readRecordingManifest } from './recording/read-recording-manifest';
export { recordingDir } from './recording/recording-dir';
export { FFMPEG_TOOL_ID } from '../recording.constants';
export type { SentSelector, SentTaggingOptions } from './recording/recording-main.type';
export type { RecordingFinalizeInput, RecordingFrame, RecordingManifest, RecordingOutcome, RecordingSentRef } from '../recording.type';
export { readVersion } from './read-version';
export type {
  DownloadProgress, FetchFn, ToolRunOptions, ToolRunResult, ToolStream, ToolsEnv, ToolsMain,
  ToolProbeResult, ToolProbe, ToolCheck, ToolRunCall, ToolRunNext, ToolRunHook, ToolHooks, ToolSpec, PathSource,
} from './tools-main.type';
export type {
  ToolArchive, ToolDef, ToolDownload, ToolLocation, ToolPlatform, ToolSource, ToolState, ToolStatus, ToolsApi,
} from '../tools.type';
