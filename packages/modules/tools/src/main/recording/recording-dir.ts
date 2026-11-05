/* @layer electron-main @kind logic */
import { RECORDINGS_DIR } from '../../recording.constants';
import { recordingSegment } from './recording-segment';
import type { RecordingPaths } from './recording-main.type';

const recordingDir = ({ paths }: RecordingPaths, scope: string, key?: string): string =>
  key === undefined
    ? paths.data(RECORDINGS_DIR, recordingSegment(scope))
    : paths.data(RECORDINGS_DIR, recordingSegment(scope), recordingSegment(key));

export { recordingDir };
