/* @layer electron-main @kind logic */
import { rmSync } from 'fs';
import { healthFilePath } from './health-file-path';

const removeHealthFile = (dataDir: string): void => {
  rmSync(healthFilePath(dataDir), { force: true });
};

export { removeHealthFile };
