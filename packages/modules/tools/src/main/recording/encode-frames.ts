/* @layer electron-main @kind logic */
import { join } from 'path';
import { FFMPEG_TOOL_ID } from '../../recording.constants';
import type { ToolsMain } from '../tools-main.type';
import { FRAME_PATTERN, VIDEO_FPS } from './recording-main.constants';

const encodeFrames = async (tools: ToolsMain, frameDir: string, outPath: string): Promise<boolean> => {
  const args = [
    '-y', '-framerate', VIDEO_FPS, '-i', join(frameDir, FRAME_PATTERN),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', outPath,
  ];
  const result = await tools.run(FFMPEG_TOOL_ID, 'ffmpeg', args);
  return result.code === 0;
};

export { encodeFrames };
