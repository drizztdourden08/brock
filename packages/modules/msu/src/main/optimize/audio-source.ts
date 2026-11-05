/* @layer electron-main @kind logic */
import type { ProbedAudio } from '../../audio-probe';
import { MSU1_SAMPLE_RATE, msu1FrameCount } from '../../msu1-format';
import type { EncoderTools } from '../encoder/encoder-tools.type';
import { probeFile } from '../encoder/probe-file';
import { MSU1_EXTENSION, MSU1_INPUT_ARGS } from './audio-source.constants';
import type { AudioSource } from './audio-source.type';

const msu1Source = (sizeBytes: number): AudioSource => ({
  inputArgs: MSU1_INPUT_ARGS,
  durationSeconds: msu1FrameCount(sizeBytes) / MSU1_SAMPLE_RATE,
  carriesLoopPoint: true,
});

const probedSource = (probed: ProbedAudio): AudioSource => ({
  inputArgs: [],
  durationSeconds: probed.durationSeconds,
  carriesLoopPoint: false,
});

const describeSource = async (
  encoder: EncoderTools, filePath: string, fileName: string, sizeBytes: number,
): Promise<AudioSource | null> => {
  if (fileName.toLowerCase().endsWith(`.${MSU1_EXTENSION}`)) return msu1Source(sizeBytes);
  const probed = await probeFile(encoder, filePath);
  return probed === null ? null : probedSource(probed);
};

export { describeSource };
export type { AudioSource };
