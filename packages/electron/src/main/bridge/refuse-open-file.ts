/* @layer electron-main @kind logic */
import { refusePrivateFile } from './refuse-private-file';

const refuseOpenFile = (file: string, problem: string | null): void => {
  if (problem) throw refusePrivateFile(file, `is open to other accounts (${problem})`);
};

export { refuseOpenFile };
