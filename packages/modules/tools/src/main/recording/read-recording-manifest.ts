/* @layer electron-main @kind logic */
import { join } from 'path';
import { readJsonFile } from '@drizztdourden08/brock-electron/main';
import type { RecordingManifest } from '../../recording.type';
import { recordingDir } from './recording-dir';
import { MANIFEST_FILE } from './recording-main.constants';
import type { RecordingPaths } from './recording-main.type';

const readRecordingManifest = (ctx: RecordingPaths, scope: string): Promise<RecordingManifest> =>
  readJsonFile<RecordingManifest>(join(recordingDir(ctx, scope), MANIFEST_FILE), {});

export { readRecordingManifest };
