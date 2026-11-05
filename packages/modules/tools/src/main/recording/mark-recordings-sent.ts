/* @layer electron-main @kind logic */
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { writeJsonFile } from '@drizztdourden08/brock-electron/main';
import type { RecordingSentRef } from '../../recording.type';
import { recordingDir } from './recording-dir';
import { MANIFEST_FILE } from './recording-main.constants';
import type { RecordingPaths } from './recording-main.type';
import { readRecordingManifest } from './read-recording-manifest';
import { recordingSegment } from './recording-segment';

const markRecordingsSent = async (ctx: RecordingPaths, { scope, keys }: RecordingSentRef, sentAt: number): Promise<void> => {
  if (keys.length === 0) return;
  const manifest = await readRecordingManifest(ctx, scope);
  for (const key of keys) manifest[recordingSegment(key)] = { sentAt };
  await mkdir(recordingDir(ctx, scope), { recursive: true });
  await writeJsonFile(join(recordingDir(ctx, scope), MANIFEST_FILE), manifest);
};

export { markRecordingsSent };
