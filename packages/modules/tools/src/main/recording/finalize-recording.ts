/* @layer electron-main @kind logic */
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Result } from '@drizztdourden08/brock-core/result';
import { FFMPEG_TOOL_ID } from '../../recording.constants';
import type { RecordingFinalizeInput, RecordingOutcome } from '../../recording.type';
import type { ToolsMain } from '../tools-main.type';
import { encodeFrames } from './encode-frames';
import { frameName } from './frame-name';
import { recordingDir } from './recording-dir';
import { SAMPLES_FILE, VIDEO_FILE } from './recording-main.constants';
import type { RecordingPaths } from './recording-main.type';

const tryEncode = async (tools: ToolsMain, dir: string): Promise<boolean> => {
  const state = await tools.state(FFMPEG_TOOL_ID).catch(() => null);
  if (state?.status !== 'ready') return false;
  return encodeFrames(tools, dir, join(dir, VIDEO_FILE)).catch(() => false);
};

const finalizeRecording = async (
  tools: ToolsMain, ctx: RecordingPaths, input: RecordingFinalizeInput,
): Promise<Result<RecordingOutcome>> => {
  try {
    const dir = recordingDir(ctx, input.scope, input.key);
    await mkdir(dir, { recursive: true });
    const lines = (input.samples ?? []).map((sample) => JSON.stringify(sample)).join('\n');
    await writeFile(join(dir, SAMPLES_FILE), lines);
    await Promise.all(input.frames.map((frame, i) => writeFile(join(dir, frameName(i)), Buffer.from(frame.png))));
    const video = input.frames.length > 0 && await tryEncode(tools, dir);
    return { success: true, value: { dir, frameCount: input.frames.length, video } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
};

export { finalizeRecording };
