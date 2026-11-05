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
export { RecordingButton, useRecordingCapture } from './recording/RecordingButton';
export { FfmpegInstallStep } from './recording/FfmpegInstallStep';
export { FfmpegRequiredDialog } from './recording/FfmpegRequiredDialog';
export { FFMPEG_TOOL_ID } from '../recording.constants';
export type { RecordingButtonProps, RecordingCaptureResult, RecordingSamplerOptions } from './recording/RecordingButton';
export type { FfmpegInstallStepProps } from './recording/FfmpegInstallStep';
export type { FfmpegRequiredDialogProps } from './recording/FfmpegRequiredDialog';
export type { RecordingFinalizeInput, RecordingOutcome } from '../recording.type';
export type { UseToolOptions, UseToolResult } from './use-tool.type';
export type { ToolState, ToolStatus, ToolsApi } from '../tools.type';
