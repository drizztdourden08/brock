/* @layer electron-main @kind logic */
import { inspectPrivateFile } from './inspect-private-file';
import { readOpenedFile } from './read-opened-file';
import { refuseOpenFile } from './refuse-open-file';
import { windowsAccessProblem } from './windows-access-problem';

const readPrivateFile = (file: string): string => {
  const uid = inspectPrivateFile(file);
  if (uid === undefined) refuseOpenFile(file, windowsAccessProblem(file));
  return readOpenedFile(file, uid);
};

export { readPrivateFile };
