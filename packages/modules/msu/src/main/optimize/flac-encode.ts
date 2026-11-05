/* @layer electron-main @kind logic */
import type { EncoderTools } from '../encoder/encoder-tools.type';
import { encodeArgs } from './encode-args';
import { encodeProgress } from './encode-progress';
import type { EncodeRequest } from './flac-encode.type';

const progressListener = (request: EncodeRequest) => {
  const { durationSeconds, onProgress } = request;
  if (!onProgress || !durationSeconds || durationSeconds <= 0) return undefined;
  return encodeProgress(durationSeconds, onProgress);
};

const encodeToTarget = async (encoder: EncoderTools, request: EncodeRequest): Promise<void> => {
  const { tools, toolId } = encoder;
  const result = await tools.run(toolId, 'ffmpeg', encodeArgs(request), { onLine: progressListener(request) });
  if (result.code === 0) return;
  throw new Error(result.stderr.trim().split('\n').pop() ?? `encoder exited with ${result.code}`);
};

export { encodeToTarget };
