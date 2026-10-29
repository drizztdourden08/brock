/* @layer electron-main @kind logic */
import { inspectPrivateFile } from './inspect-private-file';
import { readOpenedFile } from './read-opened-file';
import { refuseOpenFile } from './refuse-open-file';
import { windowsAccessProblemAsync } from './windows-access-problem-async';

const readPrivateFileAsync = async (file: string): Promise<string> => {
  const uid = inspectPrivateFile(file);
  if (uid === undefined) refuseOpenFile(file, await windowsAccessProblemAsync(file));
  return readOpenedFile(file, uid);
};

export { readPrivateFileAsync };
