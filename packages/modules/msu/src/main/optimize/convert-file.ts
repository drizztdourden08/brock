/* @layer electron-main @kind logic */
import { rm, stat } from 'fs/promises';
import { packFilePath } from '../pack-fs';
import { describeSource } from './audio-source';
import type { ConvertOutcome, ConvertRequest } from './convert-file.type';
import { encodeToTarget } from './flac-encode';
import { freeTargetName } from './pack-audio';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

const convertFile = async (request: ConvertRequest): Promise<ConvertOutcome> => {
  const { env, step, sizeBytes, taken } = request;
  const { pack, fileName: name } = step;
  const sourcePath = packFilePath(env, pack, name);
  const source = await describeSource(env, sourcePath, name, sizeBytes);
  if (source === null) return { ok: false, failure: { name, reason: 'No decoder could read this file.' } };
  const outputName = freeTargetName(name, taken);
  const destPath = packFilePath(env, pack, outputName);
  try {
    await encodeToTarget(env, {
      inputArgs: source.inputArgs,
      sourcePath,
      destPath,
      durationSeconds: source.durationSeconds,
      onProgress: (fileFraction) => { env.report({ ...step, fileFraction }); },
    });
    return { ok: true, conversion: { name, outputName, bytes: (await stat(destPath)).size } };
  } catch (err) {
    await rm(destPath, { force: true }).catch(() => {});
    return { ok: false, failure: { name, reason: messageOf(err) } };
  }
};

export { convertFile };
