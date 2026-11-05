/* @layer electron-main @kind logic */
import type { ProbedAudio } from '../../audio-probe';
import { parseProbeJson } from './ffprobe-parse';
import { PROBE_ARGS, PROBE_TIMEOUT_MS } from './ffmpeg-tool.constants';
import { cachedProbe, rememberProbe } from './probe-cache';
import type { EncoderTools } from './encoder-tools.type';

const probeFile = async (encoder: EncoderTools, filePath: string): Promise<ProbedAudio | null> => {
  const remembered = await cachedProbe(filePath);
  if (remembered) return remembered;
  try {
    const { tools, toolId } = encoder;
    const result = await tools.run(toolId, 'ffprobe', [...PROBE_ARGS, filePath], { timeoutMs: PROBE_TIMEOUT_MS });
    const probed = result.code === 0 ? parseProbeJson(result.stdout) : null;
    if (probed) await rememberProbe(filePath, probed);
    return probed;
  } catch {
    return null;
  }
};

export { probeFile };
