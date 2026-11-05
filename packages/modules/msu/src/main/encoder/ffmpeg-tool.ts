/* @layer electron-main @kind logic */
import type { ToolDef } from '@drizztdourden08/brock-tools/main';
import { DEFAULT_ENCODER_TOOL_ID } from '../msu-main.constants';
import { resolveFfmpegDownload } from './ffmpeg-release';
import { FFMPEG_LINUX_HINT, FFMPEG_OTHER_HINT, FFMPEG_VERSION } from './ffmpeg-tool.constants';

const ffmpegTool = (os: NodeJS.Platform, id: string = DEFAULT_ENCODER_TOOL_ID): ToolDef => ({
  id,
  label: 'FFmpeg',
  binaries: ['ffmpeg', 'ffprobe'],
  version: FFMPEG_VERSION,
  ...(os === 'win32' ? { resolveDownload: resolveFfmpegDownload } : {}),
  installHint: os === 'linux' ? FFMPEG_LINUX_HINT : FFMPEG_OTHER_HINT,
});

export { ffmpegTool };
