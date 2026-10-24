/* @layer electron-main @kind constants */
import { AUTOSTART_SEQUENCES, POWERSHELL_FOLDERS } from './autostart-paths.constants';
import { REPO_SEGMENTS, REPO_SEQUENCES } from './repo-paths.constants';

const OPENING_SEGMENTS: ReadonlySet<string> = new Set([
  ...REPO_SEGMENTS,
  ...REPO_SEQUENCES.flat(),
  ...AUTOSTART_SEQUENCES.flat(),
  ...POWERSHELL_FOLDERS,
]);

export { OPENING_SEGMENTS };
