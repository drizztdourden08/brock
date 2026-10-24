/* @layer electron-main @kind logic */
import { join } from 'path';
import { HEALTH_DIR, HEALTH_FILE } from './health-file.constants';

const healthFilePath = (dataDir: string): string => join(dataDir, HEALTH_DIR, HEALTH_FILE);

export { healthFilePath };
